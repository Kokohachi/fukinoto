import { getLikedCharts, supabaseGetAllCharts, supabaseGetUser, supabaseGetUserCharts, supabaseLikeChart } from "@/hooks/supabase/auth";
import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { PostgrestError } from "@supabase/supabase-js";
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
  FormHelperText,
  Container,
} from "@chakra-ui/react";

import {
  BsHash,
  BsPencil,
  BsMusicNote,
  BsFillLockFill,
  BsPencilSquare,
  BsFillUnlockFill,
  BsCalendarDate,
  BsHeartFill,
} from "react-icons/bs";
import Head from "next/head";
import { REACT_LOADABLE_MANIFEST } from "next/dist/shared/lib/constants";
export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [chartData, setChartData] = useState<any>(null);
  const [likedCharts, setLikedCharts] = useState<any>([]);
  useEffect(() => {
    supabaseGetUser().then((user) => {
      if (!user) {
        window.location.href = "/login";
      }
      setUser(user);
    });
    supabaseGetAllCharts().then((chartData) => {
      setChartData(chartData);
    });
    const createLiked = async () => {
      const likedCharts: any = await getLikedCharts();
      let liledChartsIds = [] as any;
      likedCharts.forEach((chart: any) => {
        // dont if chart is liked_on yesterday (liked_on is JST)
        const today = new Date();
        const yesterday = new Date();
        yesterday.setDate(today.getDate() - 1);
        const liked_on = new Date(chart.liked_on);
        console.log(yesterday);
        console.log(liked_on);
        //get date digit
        if (liked_on < today) return;
        liledChartsIds.push(chart.chart_id);
      });
      // add owner charts
      const userCharts: any = await supabaseGetUserCharts();
      userCharts.forEach((chart: any) => {
        liledChartsIds.push(chart.id);
      });
      setLikedCharts(liledChartsIds);
      console.log(liledChartsIds);
    };
    createLiked();
  }, [user?.id]);
  const Like = async (id: string) => {
    console.log(id);
    const Likes = await getLikedCharts();
    const TodaysLikes = Likes.filter((like: any) => {
      const today = new Date();
      const yesterday = new Date();
      yesterday.setDate(today.getDate() - 1);
      const liked_on = new Date(like.liked_on);
      return liked_on > yesterday;
    });
    console.log("today" ,TodaysLikes);
    if (TodaysLikes.length >= 3) {
      alert("今日のいいねの上限に達しました。");
      return;
    }
    const status = await supabaseLikeChart(id);
  };


  return (
    <div>
      <meta title="ダッシュボード" />
      <Header />
      <Box
        as="main"
        maxW="100%"
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
            譜面一覧
          </h3>
          <Text fontSize="1.5rem" fontWeight="normal" mb={4}>
            プレイ部門
          </Text>
        </Stack>
        <Grid templateColumns="repeat(3, 1fr)" gap={6} maxW={ "100%" }>
          {chartData?.map((chart: any) => (
            <Box key={chart.id} maxW={{ base: "100%", sm: "100%" }}>
              <GridItem width={{ base: "100%", sm: "100%" }} height={{ base: "100%", sm: "300px" }}>
                <Card
                  direction={{ base: "column", sm: "row" }}
                  overflow="hidden"
                  variant="outline"
                >
                  <Image
                    objectFit="cover"
                    width={{ base: "100%", sm: "200px" }}
                    height={{ base: "100%", sm: "300px" }}
                    src={`https://huggingface.co/datasets/yasakoko/fukinoto-database/resolve/main/charts/${chart.id}/${chart.id}.png`}
                    alt="Caffe Latte"
                  />

                  <HStack>
                    <CardBody>
                      <Heading size="md" mb="2">
                        {chart.title}
                      </Heading>
                      <Text py="1" display={"flex"} alignItems={"center"}>
                        <BsMusicNote />
                        <Text as="span" pl={2}>
                          {chart.artist}
                        </Text>
                      </Text>
                      <Text py="1" display={"flex"} alignItems={"center"}>
                        <BsPencil display="inline" />
                        <Text as="span" pl={2}>
                          {chart.author}
                        </Text>
                      </Text>
                      <Text py="1" display={"flex"} alignItems={"center"}>
                        <BsHash display="inline" />
                        <Text as="span" pl={2}>
                          {chart.id}
                        </Text>
                      </Text>
                      <Button
                        variant="solid"
                        colorScheme="pink"
                        mb={2}
                        leftIcon={<BsHeartFill />}
                        onClick={() => {Like(chart.id);}}
                        isDisabled={likedCharts.includes(chart.id)}
                      >
                        {likedCharts.includes(chart.id) ? "いいね済み" : "いいね"}
                      </Button>
                    </CardBody>
                  </HStack>
                </Card>
              </GridItem>
            </Box>
          ))}

        </Grid>
      </Box>
      <Footer />
    </div>
  );
}
