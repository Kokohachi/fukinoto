import { supabaseGetUser, supabaseGetUserCharts } from "@/hooks/supabase/auth";
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  Heading,
  Image,
  SimpleGrid,
  Stack,
  Text,
} from "@chakra-ui/react";

import { BsHash, BsPencil, BsMusicNote } from "react-icons/bs";
export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [chartData, setChartData] = useState<any>(null);
  useEffect(() => {
    supabaseGetUser().then((user) => {
      if (!user) {
        window.location.href = "/login";
      }
      setUser(user);
    });
    supabaseGetUserCharts().then((chartData) => {
      setChartData(chartData);
    });
  }, [user?.id]);
  return (
    <div>
      <Header />
      <Box
        as="main"
        maxW="5xl"
        px={{ base: "4", lg: "8" }}
        py={{ base: "4", lg: "8" }}
      >
        <Stack
          spacing={{ base: "4", lg: "4" }}
          maxW={{ lg: "2xl" }}
          textAlign="left"
          align="left"
        >
          <h3 style={{ fontSize: "2rem", fontWeight: "heavy" }}>
            ダッシュボード
          </h3>
          <Text fontSize="1.5rem" fontWeight="normal" mb={4}>
            投稿譜面
          </Text>
        </Stack>
        <Stack
          spacing={{ base: "4", lg: "4" }}
          maxW={{ lg: "2xl" }}
          textAlign="left"
          align="left"
        >
          <Card
            direction={{ base: "column", sm: "row" }}
            overflow="hidden"
            variant="outline"
          >
            <Image
              objectFit="cover"
              maxW={{ base: "100%", sm: "200px" }}
              src="https://images.unsplash.com/photo-1667489022797-ab608913feeb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxlZGl0b3JpYWwtZmVlZHw5fHx8ZW58MHx8fHw%3D&auto=format&fit=crop&w=800&q=60"
              alt="Caffe Latte"
            />

            <Stack>
              <CardBody>
                <Heading size="md" mb="2">譜面タイトル</Heading>
                <Text py="2" display={"flex"} alignItems={"center"}>
                    <BsMusicNote />
                    <Text as="span" pl={2}>作曲者名</Text>
                </Text>
                <Text py="2" display={"flex"} alignItems={"center"}>
                  <BsPencil display="inline" />
                  <Text as="span" pl={2}>譜面作者名</Text>
                </Text>
                <Text py="2" display={"flex"} alignItems={"center"}>
                  <BsHash display="inline" />
                  <Text as="span" pl={2}>譜面ID</Text>
                </Text>
              </CardBody>

              <CardFooter>
                <Button variant="ghost" colorScheme="blue">
                  公開設定
                </Button>
                <Button variant="ghost" colorScheme="blue">
                  譜面編集
                </Button>
              </CardFooter>
            </Stack>
          </Card>
        </Stack>
      </Box>
      <Footer />
    </div>
  );
}
