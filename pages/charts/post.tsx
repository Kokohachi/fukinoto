import React from "react";
import Header from "../../components/Header";
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

const steps = [
  { title: "ファイルの投稿", description: "譜面、音源、ジャケットの投稿" },
  { title: "譜面情報の記入", description: "譜面作者や楽曲作曲者の記入" },
];

export default function Post() {
  let supabase = {} as any;
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

  const { activeStep, setActiveStep } = useSteps({
    index: 0,
    count: steps.length,
  });

  const setMetadata = () => {
    console.log("set metadata");
    const reader = new FileReader();
    const chartText = reader.readAsText(chartFile || new File([], ""));
    reader.onload = () => {
      const metadata = SusAnalyzer.getMeta(reader.result as string);
      document
        .getElementById("title")
        ?.setAttribute("value", metadata.TITLE || "");
      document
        .getElementById("artist")
        ?.setAttribute("value", metadata.ARTIST || "");
      document
        .getElementById("author_name")
        ?.setAttribute("value", metadata.DESIGNER || "");
      setTitle(metadata.TITLE || "");
      setArtist(metadata.ARTIST || "");
      setAuthor(metadata.DESIGNER || "");
    };
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
  const [event, setEvent] = useState("");
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
  const handleChange = (value: any) => setValue(value);

  useEffect(() => {
    let isMounted = true; // Flag to check if the component is mounted
    supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || "",
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
      {
        auth: {
          autoRefreshToken: true,
          persistSession: true,
          detectSessionInUrl: true,
          storage: localStorage,
        },
      }
    );
    async function fetchData() {
      const isMounted = true; // Flag to check if the component is mounted
      try {
        const { data, error } = await supabase.auth.getSession();
        if (isMounted) {
          if (data.session) {
            console.log(data);

            const { data: userData, error: userError } =
              await supabase.auth.getUser();
            if (userError) {
              console.log(userError);
            }
            if (userData.user) {
              console.log(userData);
              const UID = userData.user?.id;
              const username = userData.user?.user_metadata?.full_name;
              const avatar = userData.user?.user_metadata?.avatar_url;
              const global_name =
                userData.user?.user_metadata?.custom_claims?.global_name;
              setUsername(username || "");
              setAvatar(avatar || "");
              setGlobalName(global_name || "");
              setLoggedIn(true);
              setUID(UID || "");
            }
          } else {
            window.location.href = "/login?redirectTo=/charts/post";
          }
          if (error) {
            console.log(error);
          }
        }
      } catch (error) {
        console.log(error);
      }
    }

    fetchData();

    return () => {
      isMounted = false; // Clean up the flag on unmount
    };
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

  const subscribeChart = async () => {
    console.log("started");
    setSubStatus("投稿を開始しています...");
    const nanoid = customAlphabet(
      "23456789ABCDEFGHJKLMNOPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz",
      10
    );
    const chartID = nanoid();
    setSubStatus("ファイルをアップロードしています...");
    const repo: RepoDesignation = {
      type: "dataset",
      name: process.env.NEXT_PUBLIC_HF_REPONAME || "",
    };
    const credentials: Credentials = {
      accessToken: process.env.NEXT_PUBLIC_HF_TOKEN || "",
    };
    const chartFileSuffix = chartName.split(".")[1];
    await uploadFiles({
      repo,
      credentials,
      files: [
        // path + blob content
        {
          path: "charts/" + chartID + "/" + chartID + "." + chartFileSuffix,
          content: chartFile as Blob,
        },
        {
          path: "charts/" + chartID + "/" + chartID + ".mp3",
          content: audioFile as Blob,
        },
        {
          path: "charts/" + chartID + "/" + chartID + ".png",
          content: imageFile as Blob,
        },
      ],
    });
    console.log("uploaded");
    setSubStatus("ファイルをアップロードしました...");
    await fetch(
      `${process.env.NEXT_PUBLIC_HOST}/api/upload/chart/?chartID=${chartID}&suffix=${chartFileSuffix}`
    );
    setSubStatus("譜面データの変換に成功しました...");
    setSubStatus("譜面情報を登録しています...");
    console.log("nextloaded");
    const author_id = !useHID ? username : hid;
    const supabasecli = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || "",
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
    );
    const { data, error } = await supabasecli.from("charts").insert([
      {
        id: chartID,
        title: title,
        artist: artist,
        author: author,
        author_id: author_id,
        difficulty: value,
        desc: description,
        event: event,
        tags: tags,
        play_count: 0,
        like_count: 0,
        testing: true,
        activated: true,
        user: uid,
        HID: useHID,
        publish_at: null,
      },
    ]);
    setSubStatus("譜面情報を登録しました！");
    setUploaded(true);
  };
  return (
    <div>
      <Header />
      <Box
        as="main"
        maxW="100%"
        px={{ base: "12", lg: "16" }}
        pt={{ base: "4", lg: "8" }}
        pb={{ base: "4", lg: "0" }}
        mb={{ base: "4", lg: "0" }}
      >
        {!isMobile && (
          <Stepper size="lg" index={activeStep} colorScheme="green">
            {steps.map((step, index) => (
              <Step
                key={index}
                onClick={() =>
                  activeStep > index ? setActiveStep(index) : null
                }
              >
                <StepIndicator>
                  <StepStatus
                    complete={<StepIcon />}
                    incomplete={<StepNumber />}
                    active={<StepNumber />}
                  />
                </StepIndicator>

                <Box flexShrink="0">
                  <StepTitle>{step.title}</StepTitle>
                  <StepDescription>{step.description}</StepDescription>
                </Box>

                <StepSeparator />
              </Step>
            ))}
          </Stepper>
        )}
      </Box>
      <Box
        as="main"
        maxW="100%"
        px={{ base: "12", lg: "16" }}
        py={{ base: "4", lg: "8" }}
      >
        {activeStep == 0 && (
          <Box>
            <Fade in={true}>
              <SimpleGrid columns={[1, null, 3]} spacing="40px">
                <Button
                  colorScheme={chartFile == null ? "green" : "gray"}
                  variant="outline"
                  height="300px"
                  onClick={() => handleUpload("chart")}
                >
                  <Stack
                    maxW={{ lg: "2xl" }}
                    textAlign="center"
                    alignItems={"center"}
                  >
                    <PiFileTextLight size="80px" />
                    <p id="chart_name">{chartName}</p>
                  </Stack>
                </Button>
                <Button
                  colorScheme={audioFile == null ? "green" : "gray"}
                  variant="outline"
                  height="300px"
                  onClick={() => handleUpload("audio")}
                >
                  <Stack
                    maxW={{ lg: "2xl" }}
                    textAlign="center"
                    alignItems={"center"}
                  >
                    <PiFileAudioLight size="80px" />
                    <p id="audio_name">{audioName}</p>
                  </Stack>
                </Button>
                <Button
                  colorScheme={imageFile == null ? "green" : "gray"}
                  variant="outline"
                  height="300px"
                  onClick={() => handleUpload("image")}
                >
                  <Stack
                    maxW={{ lg: "2xl" }}
                    textAlign="center"
                    alignItems={"center"}
                  >
                    <PiFileImageLight size="80px" />
                    <p id="image_name">{imageName}</p>
                  </Stack>
                </Button>
              </SimpleGrid>
              <SimpleGrid columns={[1, null, 2]} mt="40px" spacing="40px">
                <Button
                  colorScheme="gray"
                  variant="outline"
                  height="80px"
                  width={["100%", "100%", "50%"]}
                >
                  キャンセル
                </Button>

                <Button
                  colorScheme="green"
                  height="80px"
                  width={["100%", "100%", "50%"]}
                  ml={["0", "0", "auto"]}
                  isDisabled={
                    chartFile == null || audioFile == null || imageFile == null
                  }
                  onClick={() => {
                    setActiveStep(1);
                  }}
                >
                  次へ
                </Button>
              </SimpleGrid>
            </Fade>
          </Box>
        )}
        {activeStep == 1 && (
          <Box>
            <SimpleGrid columns={[1, null, 2]} spacing="0" width={"100%"}>
              <SimpleGrid
                row={[1, null, 2]}
                spacing="20px"
                width={"100%"}
                paddingRight={["0", "0", "20px"]}
                marginTop={["20px", "20px", "0"]}
              >
                <Stack>
                  <FormControl isRequired>
                    <FormLabel>タイトル</FormLabel>
                    <Input
                      placeholder="タイトル名"
                      id="title"
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
                  <FormControl isRequired>
                    <FormLabel>楽曲アーティスト</FormLabel>
                    <Input
                      placeholder="アーティスト名"
                      id="artist"
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
                  <FormControl isRequired>
                    <FormLabel>譜面作者名</FormLabel>
                    <Input
                      placeholder="譜面作者"
                      id="author_name"
                      onChange={() => {
                        setShowname(
                          (
                            document.getElementById(
                              "author_name"
                            ) as HTMLInputElement
                          ).value
                          + "@" + username
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
                {chartName.endsWith(".sus") && (
                  <Link
                    fontSize="xs"
                    color="gray.500"
                    onClick={() => setMetadata()}
                  >
                    譜面ファイルから読み込む
                  </Link>
                )}
                <Stack>
                  <FormControl isDisabled>
                    <HStack>
                      <FormLabel>隠れID</FormLabel>
                      <Text fontSize="xs" color="gray.500" marginLeft="auto">
                        <Text
                          fontSize="xs"
                          color="cyan.500"
                          display="inline"
                          fontWeight="bold"
                          id="display_name"
                        >{showname}</Text>
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
                          ).value
                          + "⧉" + hid
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
                            isRequired={useHID}
                            onChange={() => {
                              setShowname(
                                (
                                  document.getElementById(
                                    "author_name"
                                  ) as HTMLInputElement
                                ).value
                                + "⧉" + hid
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
              </SimpleGrid>
              <SimpleGrid
                row={[1, null, 2]}
                spacing="10px"
                width={"100%"}
                paddingRight={["0", "0", "20px"]}
                marginTop={["20px", "20px", "0"]}
              >
                <Stack>
                  <FormControl isRequired>
                    <FormLabel>難易度</FormLabel>
                    <Flex>
                      <NumberInput
                        maxW="100px"
                        mr="2rem"
                        value={value}
                        onChange={handleChange}
                        min={1}
                        max={75}
                        isRequired
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
                <Stack>
                  <FormControl>
                    <FormLabel>説明欄</FormLabel>
                    <Textarea
                      placeholder="説明欄"
                      gridRow={2}
                      resize="none"
                      id="description"
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
                  <FormControl isRequired>
                    <FormLabel>企画参加</FormLabel>
                    <Select
                      placeholder="選択してください..."
                      id="event"
                      onChange={() =>
                        setEvent(
                          (document.getElementById("event") as HTMLInputElement)
                            .value
                        )
                      }
                    >
                      <option value="0">なし</option>
                      <option value="1">ギミック譜面投稿祭</option>
                    </Select>
                  </FormControl>
                  <Text
                    fontSize="xs"
                    color="gray.500"
                    mt="1rem"
                    textAlign="right"
                  >
                    公開設定はテストプレイ後に調整可能です
                  </Text>
                </Stack>
              </SimpleGrid>
            </SimpleGrid>
            <SimpleGrid columns={[1, null, 2]} mt="40px" spacing="40px">
              <Button
                colorScheme="gray"
                variant="outline"
                height="80px"
                width={["100%", "100%", "50%"]}
                onClick={() => setActiveStep(0)}
              >
                戻る
              </Button>

              <Button
                colorScheme="green"
                height="80px"
                width={["100%", "100%", "50%"]}
                ml={["0", "0", "auto"]}
                isDisabled={
                  chartFile == null || audioFile == null || imageFile == null
                }
                onClick={() => {
                  onOpen();
                  subscribeChart();
                }}
              >
                投稿する
              </Button>
            </SimpleGrid>
            <Modal isOpen={isOpen} onClose={onClose} closeOnOverlayClick={false} closeOnEsc={false}>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>投稿中...</ModalHeader>
                <ModalBody>
                <Progress size='xs' isIndeterminate colorScheme="green" hidden={uploaded} />
                  {subStatus}
                </ModalBody>
                <ModalFooter>
                  <Button colorScheme="green" mr={3} onClick={
                    () => {location.href = "/"}
                  } isDisabled={!uploaded}>
                    トップへ
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
          </Box>
        )}
      </Box>
      <Footer />
      <input type="file" id="chart" accept=".sus,.usc,.chs,.mmws" hidden />
      <input type="file" id="audio" accept=".mp3" hidden />
      <input type="file" id="image" accept=".png" hidden />
    </div>
  );
}
