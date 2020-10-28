import { User } from "../entities/User";
import { MyContext } from "src/types";
import argon2 from "argon2";
import {
  Arg,
  Ctx,
  Field,
  InputType,
  Mutation,
  ObjectType,
  Query,
  Resolver,
} from "type-graphql";

@InputType()
class UsernamePasswordInput {
  @Field()
  username: string;
  @Field()
  password: string;
}

@ObjectType()
class FieldError {
  @Field()
  field: string;
  @Field()
  message: string;
}

@ObjectType()
class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];

  @Field(() => User, { nullable: true })
  user?: User;
}

@Resolver()
export class UserResolver {
  @Query(() => User, {nullable: true})
  async me(@Ctx() { em, req }: MyContext): Promise<User | null> {
    if (!req.session.userId){
        return null
    }
    return await em.findOne(User, {id: req.session.userId})
  }

  @Query(() => [User])
  Users(@Ctx() { em }: MyContext): Promise<User[]> {
    return em.find(User, {});
  }

  @Query(() => User, { nullable: true })
  User(@Arg("id") id: number, @Ctx() { em }: MyContext): Promise<User | null> {
    return em.findOne(User, { id });
  }
  
  @Mutation(() => UserResponse)
  async register(
    @Arg("options") options: UsernamePasswordInput,
    @Ctx() { em, req }: MyContext
  ): Promise<UserResponse> {
    const errors = []

    if (options.username.length < 2) {
      errors.push({
        field: "username",
        message: "username must be greater than 2 characters",
      })
    }
    
    if (options.password.length < 2){
      errors.push({
        field: "password",
        message: "password must be greater than 2 characters",
      })
    }

    if (errors.length){
     return {errors}
    }

    const passHash = await argon2.hash(options.password);
    const user = em.create(User, {
      username: options.username,
      password: passHash,
    });

    try {
      await em.persistAndFlush(user);
    } catch (err) {
      if (err.code === "23505") {
        return {
          errors: [
            {
              field: "username",
              message: `user already exists ${options.username}`,
            },
          ],
        };
      }
      console.log(`error when trying to register user. ${err.message}`);
    }
    req.session.userId = user.id

    return { user };
  }

  @Mutation(() => UserResponse)
  async login(
    @Arg("options") options: UsernamePasswordInput,
    @Ctx() { em, req }: MyContext
  ): Promise<UserResponse> {
    const user = await em.findOne(User, { username: options.username });
    if (!user) {
      return {
        errors: [
          {
            field: "username",
            message: "that username doesn't exist",
          },
        ],
      };
    }

    const valid = await argon2.verify(user.password, options.password);
    console.log(`valid is ${valid}, username: ${user.username}`);
    if (!valid) {
      return {
        errors: [
          {
            field: "password",
            message: "invalid username or password",
          },
        ],
      };
    }
    req.session.userId = user.id

    return { user };
  }

  @Mutation(() => Boolean)
  async deleteUser(
    @Arg("id") id: number,
    @Ctx() { em }: MyContext
  ): Promise<boolean> {
    try {
      await em.nativeDelete(User, { id });
      return true;
    } catch (error) {
      return false;
    }
  }
}
