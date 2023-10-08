import React from "react";
import Header from "@/components/Header";
import {
  Center,
  Box,
  Text,
  Stack,
  useSteps,
  Step,
  Stepper,
  StepIndicator,
  StepStatus,
  StepIcon,
  StepTitle,
  StepNumber,
  StepDescription,
  StepSeparator,
  useBreakpointValue,
  SimpleGrid,
  Button,
  Fade,
  ScaleFade,
  Slide,
  SlideFade,
  Collapse,
  useDisclosure,
  HStack,
  GridItem,
  Input,
  Divider,
  FormControl,
  FormLabel,
  Radio,
  RadioGroup,
  InputGroup,
  InputLeftElement,
  Link,
  Tooltip,
  Flex,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  Slider,
  SliderFilledTrack,
  SliderThumb,
  SliderTrack,
  Textarea,
  Checkbox,
  Tag,
  TagProps,
  TagCloseButton,
  Select,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Progress,
} from "@chakra-ui/react";
import * as SusAnalyzer from "@sekai-world/sus-analyzer";
import { customAlphabet } from "nanoid";
import {
  createRepo,
  uploadFiles,
  deleteFile,
  deleteRepo,
  listFiles,
  whoAmI,
} from "@huggingface/hub";
import type { RepoDesignation, Credentials } from "@huggingface/hub";

import {
  PiFileTextLight,
  PiFileAudioLight,
  PiFileImageLight,
} from "react-icons/pi";

import { useState, useEffect } from "react";
import { SupabaseClient, createClient } from "@supabase/supabase-js";
import Footer from "@/components/Footer";
import {
  supabaseAddChart,
  supabaseGetChart,
  supabaseGetUser,
  supabaseGetUserCharts,
  supabaseUpdateChart,
} from "@/hooks/supabase/auth";
import sharp from "sharp";
import { convertToObject } from "typescript";
import { useRouter } from "next/router";

export default function Post() {
  const handleUpload = (filetype: string) => {
    console.log("upload" + filetype);
    if (filetype == "chart") {
      const chartInput =
        (document.getElementById("chart") as HTMLInputElement) ||
        new HTMLInputElement();
      if (chartInput) {
        chartInput.click();
        // after chosen show file name
        chartInput.addEventListener("change", function (event) {
          const chartFile = chartInput.files && chartInput.files[0];
          if (chartFile) {
            const chartName = document.getElementById("chart_name");
            if (chartName) {
              setChartName(chartFile.name);
              setChartFile(chartFile);
            }
          }
        });
      }
    }
    if (filetype == "audio") {
      const audioInput =
        (document.getElementById("audio") as HTMLInputElement) ||
        new HTMLInputElement();
      if (audioInput) {
        audioInput.click();
        // after chosen show file name
        audioInput.addEventListener("change", function (event) {
          const audioFile = audioInput.files && audioInput.files[0];
          if (audioFile) {
            const audioName = document.getElementById("audio_name");
            if (audioName) {
              setAudioName(audioFile.name);
              setAudioFile(audioFile);
            }
          }
        });
      }
    }
    if (filetype == "image") {
      const imageInput =
        (document.getElementById("image") as HTMLInputElement) ||
        new HTMLInputElement();
      if (imageInput) {
        imageInput.click();
        // after chosen show file name
        imageInput.addEventListener("change", function (event) {
          const imageFile = imageInput.files && imageInput.files[0];
          if (imageFile) {
            const imageName = document.getElementById("image_name");
            if (imageName) {
              setImageName(imageFile.name);
              setImageFile(imageFile);
            }
          }
        });
      }
    }
  };

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [chartFile, setChartFile] = useState<File | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [chartName, setChartName] = useState("譜面ファイル");
  const [audioName, setAudioName] = useState("音源ファイル");
  const [imageName, setImageName] = useState("ジャケット画像");
  const [useHID, setUseHID] = useState(false);
  const [noplay, setNoplay] = useState(false);
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [event, setEvent] = useState("1");
  const isMobile = useBreakpointValue({ base: true, lg: false });
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [avatar, setAvatar] = useState("");
  const [global_name, setGlobalName] = useState("");
  const [uid, setUID] = useState("");
  const [value, setValue] = React.useState(30);
  const [textpl, setTextpl] = useState(0);
  const [tags, setTags] = useState<string[]>([]);
  const [hid, setHid] = useState("");
  const [subStatus, setSubStatus] = useState("投稿を開始しています...");
  const [uploaded, setUploaded] = useState(false);
  const [showname, setShowname] = useState("");
  const [isPlay, setIsPlay] = useState(false)
  const handleChange = (value: any) => setValue(value);
  useEffect(() => {
    supabaseGetUser().then((user) => {
      if (user) {
        console.log(user);
        setUsername(user.user_metadata.full_name || "");
        setAvatar(user.user_metadata.avatar_url || "");
        setGlobalName(user.user_metadata.custom_claims.global_name || "");
        setLoggedIn(true);
        setUID(user.id || "");
      } else {
        location.href = "/login";
      }
      const chartID = window.location.pathname.split("/")[3];
      supabaseGetChart(chartID as string).then((chart) => {
        console.log(chartID);
        if (typeof chart[0] === "undefined") {
          location.href = "/user/dashboard";
        }
        if (chart) {
          console.log(chart[0]);
          if (chart[0].user != user?.id) {
            location.href = "/user/dashboard";
          }
          if (chart[0].event == "1") {
            setIsPlay(true)
          }
          console.log(chart[0].title);
          setTitle(chart[0].title);
          setArtist(chart[0].artist);
          setAuthor(chart[0].author);
          setDescription(chart[0].desc);
          setEvent(chart[0].event);
          setValue(chart[0].difficulty);
          setNoplay(chart[0].difficulty == 99);
          console.log(JSON.parse(chart[0].tags));
          setTags(JSON.parse(chart[0].tags));
        }
      });
    });
  }, []);

  if (typeof window === "object") {
    const tag_input = document.getElementById("tag_input") as HTMLInputElement;
    document.onkeydown = function (e) {
      if (e.key == "Enter") {
        if (tag_input) {
          if (tag_input.value != "") {
            if (tags.includes(tag_input.value)) {
              console.log("already exists");
              tag_input.value = "";
              return;
            }
            setTextpl(document.getElementById("tag")?.clientWidth || 0);
            setTags([...tags, tag_input.value]);
            tag_input.value = "";
            setTextpl(document.getElementById("tag")?.clientWidth || 0);
            console.log(document.getElementById("tag")?.clientWidth);
          }
        }
      }
    };
  }

  const updateChart = async () => {
    //update chart if chart file is uploaded
    setSubStatus("ファイルをアップロードしています...");
    const chartID = window.location.pathname.split("/")[3];
    const repo: RepoDesignation = {
      type: "dataset",
      name: process.env.NEXT_PUBLIC_HF_REPONAME || "",
    };
    const credentials: Credentials = {
      accessToken: process.env.NEXT_PUBLIC_HF_TOKEN || "",
    };
    if (chartFile) {
      const chartFileSuffix = chartFile.name.split(".")[1];
      await uploadFiles({
        repo,
        credentials,
        files: [
          {
            path: `charts/` + chartID + `/` + chartID + "." + chartFileSuffix,
            content: chartFile as Blob,
          },
        ],
      });
      await fetch(
        `${process.env.NEXT_PUBLIC_HOST}/api/upload/chart/?chartID=${chartID}&suffix=${chartFileSuffix}`
      );
    }
    if (audioFile) {
      await uploadFiles({
        repo,
        credentials,
        files: [
          {
            path: `charts/` + chartID + `/` + chartID + ".mp3",
            content: audioFile as Blob,
          },
        ],
      });
    }
    if (imageFile) {
      await uploadFiles({
        repo,
        credentials,
        files: [
          {
            path: `charts/` + chartID + `/` + chartID + ".png",
            content: imageFile as Blob,
          },
        ],
      });
    }
    setSubStatus("データベースに登録しています...");
    supabaseUpdateChart(
      chartID,
      title,
      artist,
      author,
      username,
      value,
      description,
      event,
      JSON.stringify(tags),
      useHID,
      uid
    ).then(() => {
      setUploaded(true);
      setSubStatus("投稿が完了しました！");
      setTimeout(function () {
        location.href = "/user/dashboard";
      }, 1000);
    });
  };
    return (
      <div>
        <Header />
        <Box
          as="main"
          maxW="100%"
          px={{ base: "12", lg: "16" }}
          py={{ base: "4", lg: "8" }}
        >
          <SimpleGrid columns={[1, null, 3]} spacing="40px">
            <Button
              colorScheme={chartFile == null ? "green" : "gray"}
              variant="outline"
              height="120px"
              onClick={() => handleUpload("chart")}
              isDisabled={isPlay}
            >
              <Stack
                maxW={{ lg: "2xl" }}
                textAlign="center"
                alignItems={"center"}
              >
                <PiFileTextLight size="80px" />
                <Text id="chart_name">{chartName}</Text>
              </Stack>
            </Button>
            <Button
              colorScheme={audioFile == null ? "green" : "gray"}
              variant="outline"
              height="120px"
              onClick={() => handleUpload("audio")}
            >
              <Stack
                maxW={{ lg: "2xl" }}
                textAlign="center"
                alignItems={"center"}
              >
                <PiFileAudioLight size="80px" />
                <Text id="audio_name">{audioName}</Text>
              </Stack>
            </Button>
            <Button
              colorScheme={imageFile == null ? "green" : "gray"}
              variant="outline"
              height="120px"
              onClick={() => handleUpload("image")}
            >
              <Stack
                maxW={{ lg: "2xl" }}
                textAlign="center"
                alignItems={"center"}
              >
                <PiFileImageLight size="80px" />
                <Text id="image_name">{imageName}</Text>
              </Stack>
            </Button>
          </SimpleGrid>
          <Box mt={2}>
            <SimpleGrid columns={[1, null, 2]}>
              <Stack
                spacing={2}
                width={"100%"}
                paddingRight={["0", "0", "20px"]}
                marginTop={["20px", "20px", "0"]}
              >
                <Stack>
                  <FormControl>
                    <FormLabel>タイトル</FormLabel>
                    <Input
                      placeholder="タイトル名"
                      id="title"
                      value={title}
                      onChange={() =>
                        setTitle(
                          (document.getElementById("title") as HTMLInputElement)
                            .value
                        )
                      }
                    />
                  </FormControl>
                </Stack>
                <Stack>
                  <FormControl>
                    <FormLabel>楽曲アーティスト</FormLabel>
                    <Input
                      placeholder="アーティスト名"
                      id="artist"
                      value={artist}
                      onChange={() =>
                        setArtist(
                          (
                            document.getElementById(
                              "artist"
                            ) as HTMLInputElement
                          ).value
                        )
                      }
                    />
                  </FormControl>
                </Stack>
                <Stack>
                  <FormControl>
                    <FormLabel>譜面作者名</FormLabel>
                    <Input
                      placeholder="譜面作者"
                      id="author_name"
                      value={author}
                      onChange={() => {
                        setShowname(
                          (
                            document.getElementById(
                              "author_name"
                            ) as HTMLInputElement
                          ).value +
                            "@" +
                            username
                        );
                        setAuthor(
                          (
                            document.getElementById(
                              "author_name"
                            ) as HTMLInputElement
                          ).value
                        );
                        console.log(
                          (
                            document.getElementById(
                              "author_name"
                            ) as HTMLInputElement
                          ).value
                        );
                      }}
                    />
                  </FormControl>
                </Stack>
                <Stack>
                  <FormControl isDisabled>
                    <HStack>
                      <FormLabel>隠れID</FormLabel>
                      <Text fontSize="xs" color="gray.500" marginLeft="auto">
                        <Text
                          as={"span"}
                          fontSize="xs"
                          color="cyan.500"
                          display="inline"
                          fontWeight="bold"
                          id="display_name"
                        >
                          {showname}
                        </Text>
                        と表示されます
                      </Text>
                    </HStack>
                    <RadioGroup
                      defaultValue="1"
                      colorScheme="pink"
                      onChange={(value) => {
                        setUseHID(value == "2");
                        setShowname(
                          (
                            document.getElementById(
                              "author_name"
                            ) as HTMLInputElement
                          ).value +
                            "⧉" +
                            hid
                        );
                      }}
                    >
                      <Stack spacing={5} direction="row">
                        <Radio value="1">使用しない</Radio>
                        <Radio marginLeft="auto" value="2">
                          使用する
                        </Radio>
                        <InputGroup
                          marginLeft={"auto"}
                          maxWidth={["100%", "50%"]}
                        >
                          <InputLeftElement>
                            <Text>⧉</Text>
                          </InputLeftElement>
                          <Input
                            placeholder="隠れID"
                            isDisabled={!useHID}
                            id="hid"
                            onChange={() => {
                              setShowname(
                                (
                                  document.getElementById(
                                    "author_name"
                                  ) as HTMLInputElement
                                ).value +
                                  "⧉" +
                                  hid
                              );
                              setHid(
                                (
                                  document.getElementById(
                                    "hid"
                                  ) as HTMLInputElement
                                ).value
                              );
                            }}
                          />
                        </InputGroup>
                      </Stack>
                    </RadioGroup>
                  </FormControl>
                </Stack>
                <Stack>
                  <FormControl>
                    <FormLabel>難易度</FormLabel>
                    <Flex>
                      <NumberInput
                        maxW="100px"
                        mr="2rem"
                        value={value}
                        onChange={handleChange}
                        min={1}
                        max={75}
                        isDisabled={noplay}
                      >
                        <NumberInputField />
                        <NumberInputStepper>
                          <NumberIncrementStepper />
                          <NumberDecrementStepper />
                        </NumberInputStepper>
                      </NumberInput>
                      <Slider
                        flex="1"
                        focusThumbOnChange={false}
                        value={value}
                        onChange={handleChange}
                        min={5}
                        max={50}
                        isDisabled={noplay}
                      >
                        <SliderTrack>
                          <SliderFilledTrack />
                        </SliderTrack>
                        <SliderThumb fontSize="sm" boxSize="32px">
                          {value}
                        </SliderThumb>
                      </Slider>
                    </Flex>
                    <Checkbox
                      colorScheme="pink"
                      size="md"
                      mt="1rem"
                      isChecked={noplay}
                      onChange={() => {
                        if (!noplay) {
                          setValue(99);
                        }
                        setNoplay(!noplay);
                      }}
                    >
                      観賞用
                    </Checkbox>
                  </FormControl>
                </Stack>
              </Stack>
              <Stack
                spacing={2}
                width={"100%"}
                paddingRight={["0", "0", "20px"]}
                marginTop={["20px", "20px", "0"]}
              >
                <Stack>
                  <FormControl>
                    <FormLabel>説明欄</FormLabel>
                    <Textarea
                      placeholder="説明欄"
                      gridRow={2}
                      resize="none"
                      id="description"
                      value={description}
                      onChange={() =>
                        setDescription(
                          (
                            document.getElementById(
                              "description"
                            ) as HTMLInputElement
                          ).value
                        )
                      }
                    />
                  </FormControl>
                </Stack>
                <Stack>
                  <FormControl>
                    <FormLabel>タグ</FormLabel>
                    {/* Tag Input using space or enter */}
                    <InputGroup
                      onChange={() => {
                        setTextpl(
                          document.getElementById("tag")?.clientWidth || 0
                        );
                      }}
                    >
                      <InputLeftElement
                        ml={2}
                        width={"auto"}
                        id="tag"
                        onChange={() => {
                          setTextpl(
                            document.getElementById("tag")?.clientWidth || 0
                          );
                        }}
                      >
                        {tags.map((tag) => (
                          <Tag
                            size="md"
                            borderRadius="full"
                            key={tag}
                            variant="solid"
                            colorScheme="pink"
                            mr={1}
                            mb={1}
                          >
                            {tag}
                            <TagCloseButton
                              onClick={() => {
                                setTextpl(
                                  document.getElementById("tag")?.clientWidth ||
                                    0
                                );
                                setTags(tags.filter((t) => t != tag));
                              }}
                            />
                          </Tag>
                        ))}
                      </InputLeftElement>
                      <Input
                        gridRow={2}
                        resize="none"
                        id="tag_input"
                        pl={textpl + 10}
                        disabled={tags.length >= 5}
                      />
                      <Text fontSize="xs" color="gray.500" ml={2}>
                        {tags.length}/5
                      </Text>
                    </InputGroup>
                  </FormControl>
                </Stack>
                <Stack>
                  <FormControl>
                    <FormLabel>企画参加</FormLabel>
                    <Select
                      placeholder="選択してください..."
                      id="event"
                      isDisabled={true}
                      onChange={() =>
                        setEvent(
                          (document.getElementById("event") as HTMLInputElement)
                            .value
                        )
                      }
                      value={event}
                    >
                      <option value="1">ギミック譜面投稿祭プレイ部門</option>
                      <option value="2">ギミック譜面投稿祭観賞用部門</option>
                    </Select>
                  </FormControl>
                  <Text
                    fontSize="xs"
                    color="gray.500"
                    mt="1rem"
                    textAlign="right"
                  >
                    公開設定はダッシュボードから調整可能です
                  </Text>
                </Stack>
                <HStack>
                  <Button
                    colorScheme="green"
                    height="80px"
                    width={["100%", "100%", "50%"]}
                    ml={["0", "0", "auto"]}
                    onClick={() => {
                      location.href = "/user/dashboard";
                    }}
                    variant={"outline"}
                  >
                    戻る
                  </Button>
                  <Button
                    colorScheme="green"
                    height="80px"
                    width={["100%", "100%", "50%"]}
                    ml={["0", "0", "auto"]}
                    onClick={() => {
                      onOpen();
                      updateChart();
                    }}
                  >
                    更新する
                  </Button>
                </HStack>
              </Stack>
            </SimpleGrid>

            <Modal
              isOpen={isOpen}
              onClose={onClose}
              closeOnOverlayClick={false}
              closeOnEsc={false}
              isCentered
            >
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>投稿中...</ModalHeader>
                <ModalBody>
                  {subStatus}
                  <Progress
                    size="xs"
                    isIndeterminate
                    colorScheme="green"
                    hidden={uploaded}
                  />
                </ModalBody>
              </ModalContent>
            </Modal>
          </Box>
        </Box>
        <Footer />
        <input type="file" id="chart" accept=".sus,.usc,.chs,.mmws" hidden />
        <input type="file" id="audio" accept=".mp3" hidden />
        <input type="file" id="image" accept=".png" hidden />
      </div>
    );
  };
