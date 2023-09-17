import Header from "@/components/Header";
import Footer from "@/components/Footer";

import {
  Box,
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardFooter,
  FormControl,
  Grid,
  GridItem,
  HStack,
  Heading,
  Image,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  RadioGroup,
  Stack,
  Text,
  useDisclosure,
  Radio,
  Input,
  Checkbox,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { supabaseGetUser, supabaseGetUserCharts } from "@/hooks/supabase/auth";
import { useEffect } from "react";

export default function edit() {
    const Router = useRouter()
    const { id } = Router.query
    useEffect(() => {
    supabaseGetUser().then((user) => {
        if (!user) {
          location.href = "/login";
        }
      });
    }, []);
    return (
        <>
        <Header />
        <Box
        as="main"
        maxW="100%"
        px={{ base: "4", lg: "8" }}
        py={{ base: "4", lg: "8" }}
      >
        <Text fontSize="2xl" fontWeight="bold" mb="4">
            id: {id}
            </Text>
        </Box>
        <Footer />
      </>
    )
}
