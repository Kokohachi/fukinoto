import { supabaseGetUser, supabaseGetUserCharts } from "@/hooks/supabase/auth";
import { useEffect, useState } from "react";
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
  FormHelperText,
} from "@chakra-ui/react";

import {
  BsHash,
  BsPencil,
  BsMusicNote,
  BsFillLockFill,
  BsPencilSquare,
  BsFillUnlockFill,
  BsCalendarDate,
} from "react-icons/bs";
import Head from "next/head";
export default function Dashboard() {
  const [user, setUser] = useState<any>(null);
  const [chartData, setChartData] = useState<any>(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [isPublic, setIsPublic] = useState<boolean>(false);
  const [openTime, setOpenTime] = useState<Date>(new Date());
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
            ダッシュボード
          </h3>
          <Text fontSize="1.5rem" fontWeight="normal" mb={4}>
            投稿譜面
          </Text>
        </Stack>
        <Grid templateColumns="repeat(2, 1fr)" gap={6}>
          {chartData?.map((chart: any) => (
            <>
              <GridItem width={{ base: "100%", sm: "2xl" }} key={chart.id}>
                <Card
                  direction={{ base: "column", sm: "row" }}
                  overflow="hidden"
                  variant="outline"
                >
                  <Image
                    objectFit="cover"
                    maxW={{ base: "100%", sm: "200px" }}
                    src={`${process.env.NEXT_PUBLIC_HOST}/api/charts/image/?id=${chart.id}`}
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
                      <Text py="1" display={"flex"} alignItems={"center"}>
                        <BsCalendarDate display="inline" />
                        <Text as="span" pl={2}>
                          {new Date(chart.created_at).toLocaleString()}
                        </Text>
                      </Text>
                    </CardBody>
                    <CardBody>
                      <Button
                        variant="solid"
                        colorScheme="pink"
                        mb={2}
                        leftIcon={<BsFillLockFill />}
                        onClick={onOpen}
                      >
                        公開設定
                      </Button>
                      <Button
                        variant="solid"
                        colorScheme="pink"
                        mb={2}
                        isDisabled={true}
                        leftIcon={<BsPencilSquare />}
                        onClick={() => {
                          window.location.href = `/charts/edit/${chart.id}`;
                        }}
                      >
                        開発中
                      </Button>
                    </CardBody>
                  </HStack>
                </Card>
              </GridItem>
              <Modal
                isOpen={isOpen}
                onClose={onClose}
                closeOnOverlayClick={false}
                isCentered
              >
                <ModalOverlay key={chart.id} />

                <ModalContent>
                  <ModalHeader>公開設定</ModalHeader>

                  <ModalBody>

                    <FormControl>

                      <RadioGroup
                        colorScheme="teal"
                        id="public"
                        onChange={(e) => {
                          setIsPublic(e == "1");
                        }}
                        isDisabled={true}

                      >
                        <Stack spacing={5}>
                          <Radio value="1">公開</Radio>
                          <Checkbox
                            hidden={!isPublic}
                            colorScheme="teal"
                            id="openTimeCheck"
                            onChange={(e) => {
                              setOpenTime(new Date());
                            }}
                          >
                            予約投稿
                          </Checkbox>
                          <Input
                            hidden={
                              !(
                                document?.getElementById(
                                  "openTimeCheck"
                                ) as HTMLInputElement
                              )?.checked
                            }
                            type="datetime-local"
                            id="openTime"
                            onChange={(e) => {
                              setOpenTime(new Date(e.target.value));
                            }}
                          />
                          <Radio value="2">非公開</Radio>
                        </Stack>
                      </RadioGroup>
                      <FormHelperText>イベント期間中は変更できないらしい</FormHelperText>
                    </FormControl>
                  </ModalBody>

                  <ModalFooter>
                    <Button colorScheme="teal" mr={3} onClick={onClose}>
                      閉じる
                    </Button>
                  </ModalFooter>
                </ModalContent>
              </Modal>
            </>
          ))}

        </Grid>
      </Box>
      <Footer />
    </div>
  );
}
