import { Box, Button, Flex, Link } from "@chakra-ui/core";
import * as React from "react";
import NextLink from "next/link";
import { useMeQuery } from "../generated/graphql";

interface NavBarProps {}

const NavBar: React.FC<NavBarProps> = () => {
  const [{ data, fetching }] = useMeQuery();
  let body = null;

  if (fetching) {
    //data is loading
  } else if (!data?.me) {
    console.log("its here");
    body = (
      <>
        <NextLink href="/login">
          <Link mr={2}>login</Link>
        </NextLink>
        <NextLink href="/register">
          <Link mr={2}>register</Link>
        </NextLink>
      </>
    );
  } else {
    console.log("its here2");
    body = (
      <Flex>
        <Box mr={2}>{data.me.username}</Box>
        <Box>
          <Button variant="link">Logout</Button>
        </Box>
      </Flex>
    );
  }

  return (
    <Flex bg="tomato" p={4} ml={"auto"}>
      {body}
    </Flex>
  );
};

export default NavBar;
