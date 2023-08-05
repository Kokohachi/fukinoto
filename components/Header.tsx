import {
  Box,
  Flex,
  Text,
  IconButton,
  Button,
  Stack,
  Collapse,
  Icon,
  Popover,
  PopoverTrigger,
  PopoverContent,
  useColorModeValue,
  useBreakpointValue,
  useDisclosure,
  Spacer,
  Avatar,
} from "@chakra-ui/react";
import {
  HamburgerIcon,
  CloseIcon,
  ChevronDownIcon,
  ChevronRightIcon,
} from "@chakra-ui/icons";

import { createClient } from "@supabase/supabase-js";

import { MdGrass } from "react-icons/md";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { useEffect } from "react";

export default function Header() {
  const { isOpen, onToggle } = useDisclosure();
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
    {auth:{persistSession:true}}
    );
  const isMobile = useBreakpointValue({ base: true, md: false });

  const router = useRouter();
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [avatar, setAvatar] = useState("");
  const [global_name, setGlobalName] = useState("");

  useEffect(() => {
    let isMounted = true; // Flag to check if the component is mounted

    async function fetchData() {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (isMounted) {
          if (data.session) {
            console.log(data);

            const { data: userData, error: userError } = await supabase.auth.getUser();
            if (userError) {
              console.log(userError);
            }
            if (userData.user) {
              console.log(userData);
              const username = userData.user?.user_metadata?.full_name;
              const avatar = userData.user?.user_metadata?.avatar_url;
              const global_name = userData.user?.user_metadata?.custom_claims?.global_name;
              setUsername(username || "");
              setAvatar(avatar || "");
              setGlobalName(global_name || "");
              setLoggedIn(true);

            }
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


  return (
    <Box>
      <Flex
        bg={useColorModeValue("white", "gray.800")}
        color={useColorModeValue("gray.600", "white")}
        minH={"60px"}
        py={{ base: 2 }}
        px={{ base: 4 }}
        borderBottom={1}
        borderStyle={"solid"}
        borderColor={useColorModeValue("gray.200", "gray.900")}
        align={{ base: "center", lg: "center" }}
      >
        <Flex
          flex={{ base: 1, md: "auto" }}
          ml={{ base: -2 }}
          display={{ base: "flex", md: "none" }}
        >
          <IconButton
            onClick={onToggle}
            icon={
              isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />
            }
            variant={"ghost"}
            aria-label={"Toggle Navigation"}
          />
        </Flex>
        <Flex
          flex={{ base: 1 }} // Allow the logo to take all the available space on small screens
          justify={{ base: "center", lg: "start" }} // Center on small screens, start on medium screens
          align="center"
        >
          <Stack direction="column" align="center" spacing={1}>

            <Text
              fontFamily={"heading"}
              color={useColorModeValue("gray.800", "white")}
              fontSize={{ base: "18px", md: "18px" }}
            >
              <Link href="/">
                {useBreakpointValue({ base: "𝔽 ", md: "𝔽 ¦ ふきのとう" })}
              </Link>
            </Text>
            {!isMobile && (
              <Text fontSize="xs" color="gray.500">
                譜面企画部の投稿サイト
              </Text>
            )}

          </Stack>
          <Flex display={{ base: "none", md: "flex" }} ml={10}>
            <DesktopNav />
          </Flex>
        </Flex>
        {isMobile && ( // Only show Avatar and Username on mobile screens
          <Spacer />
        )}
        {!isMobile && (


        (loggedIn)? (
          <div>
            <Stack
              flex={{ base: 1, md: 0 }}
              justify={"flex-end"}
              align={"center"} // Add align prop to center the content
              direction={"row"}
              spacing={6}
            >
              <Avatar
                name={username}
                src={avatar}
                size={"md"}
              />
              <Stack
                direction={"column"}
                align={"left"}
                display={{ base: "none", md: "flex" }}
                spacing={0}
              >
                <Text fontSize={"sm"} fontWeight={600}>
                  {global_name}
                </Text>
              <Text
                fontSize={"sm"}
                fontWeight={600}
                color={"gray.400"}
                align={"center"}
              >
                @{username}
              </Text>
              </Stack>

              <Button
                as={"a"}
                display={{ base: "none", md: "inline-flex" }}
                fontSize={"sm"}
                fontWeight={600}
                color={"white"}
                bg={"pink.400"}
                onClick={() => {
                  router.push("/charts/post");
                }}
                _hover={{
                  bg: "pink.300",
                }}
              >
                譜面投稿
              </Button>
            </Stack>
          </div>
        ) : (
          <div>
          <Stack
            flex={{ base: 1, md: 0 }}
            justify={"flex-end"}
            align={"center"} // Add align prop to center the content
            direction={"row"}
            spacing={6}
          >

            <Button
              as={"a"}
              display={{ base: "none", md: "inline-flex" }}
              fontSize={"sm"}
              fontWeight={600}
              color={"white"}
              bg={"pink.400"}
              onClick={() => {
                supabase.auth.signInWithOAuth({
                  provider: "discord",
                });
                console.log("pressed");
                router.reload();
              }}
              _hover={{
                bg: "pink.300",
              }}
            >
              ログイン
            </Button>
          </Stack>
        </div>
        ))}
      </Flex>
      <Collapse in={isOpen} animateOpacity>
        <MobileNav />
      </Collapse>
    </Box>
  );
}

const DesktopNav = () => {
  const linkColor = useColorModeValue("gray.600", "gray.200");
  const linkHoverColor = useColorModeValue("gray.800", "white");
  const popoverContentBgColor = useColorModeValue("white", "gray.800");

  return (
    <Stack direction={"row"} spacing={4}>
      {NAV_ITEMS.map((navItem) => (
        <Box key={navItem.label}>
          <Popover trigger={"hover"} placement={"bottom-start"}>
            <PopoverTrigger>
              <Box
                as="a"
                p={2}
                href={navItem.href ?? "#"}
                fontSize={"sm"}
                fontWeight={500}
                color={linkColor}
                _hover={{
                  textDecoration: "none",
                  color: linkHoverColor,
                }}
              >
                {navItem.label}
              </Box>
            </PopoverTrigger>

            {navItem.children && (
              <PopoverContent
                border={0}
                boxShadow={"xl"}
                bg={popoverContentBgColor}
                p={4}
                rounded={"xl"}
                minW={"sm"}
              >
                <Stack>
                  {navItem.children.map((child) => (
                    <DesktopSubNav key={child.label} {...child} />
                  ))}
                </Stack>
              </PopoverContent>
            )}
          </Popover>
        </Box>
      ))}
    </Stack>
  );
};

const DesktopSubNav = ({ label, href, subLabel }: NavItem) => {
  return (
    <Box
      as="a"
      href={href}
      role={"group"}
      display={"block"}
      p={2}
      rounded={"md"}
      _hover={{ bg: useColorModeValue("pink.50", "gray.900") }}
    >
      <Stack direction={"row"} align={"center"}>
        <Box>
          <Text
            transition={"all .3s ease"}
            _groupHover={{ color: "pink.400" }}
            fontWeight={500}
          >
            {label}
          </Text>
          <Text fontSize={"sm"}>{subLabel}</Text>
        </Box>
        <Flex
          transition={"all .3s ease"}
          transform={"translateX(-10px)"}
          opacity={0}
          _groupHover={{ opacity: "100%", transform: "translateX(0)" }}
          justify={"flex-end"}
          align={"center"}
          flex={1}
        >
          <Icon color={"pink.400"} w={5} h={5} as={ChevronRightIcon} />
        </Flex>
      </Stack>
    </Box>
  );
};

const MobileNav = () => {
  return (
    <Stack
      bg={useColorModeValue("white", "gray.800")}
      p={4}
      display={{ md: "none" }}
    >
      {NAV_ITEMS.map((navItem) => (
        <MobileNavItem key={navItem.label} {...navItem} />
      ))}
    </Stack>
  );
};

const MobileNavItem = ({ label, children, href }: NavItem) => {
  const { isOpen, onToggle } = useDisclosure();

  return (
    <Stack spacing={4} onClick={children && onToggle}>
      <Box
        py={2}
        as="a"
        href={href ?? "#"}
        justifyContent="space-between"
        alignItems="center"
        _hover={{
          textDecoration: "none",
        }}
      >
        <Text
          fontWeight={600}
          color={useColorModeValue("gray.600", "gray.200")}
        >
          {label}
        </Text>
        {children && (
          <Icon
            as={ChevronDownIcon}
            transition={"all .25s ease-in-out"}
            transform={isOpen ? "rotate(180deg)" : ""}
            w={6}
            h={6}
          />
        )}
      </Box>

      <Collapse in={isOpen} animateOpacity style={{ marginTop: "0!important" }}>
        <Stack
          mt={2}
          pl={4}
          borderLeft={1}
          borderStyle={"solid"}
          borderColor={useColorModeValue("gray.200", "gray.700")}
          align={"start"}
        >
          {children &&
            children.map((child) => (
              <Box as="a" key={child.label} py={2} href={child.href}>
                {child.label}
              </Box>
            ))}
        </Stack>
      </Collapse>
    </Stack>
  );
};

interface NavItem {
  label: string;
  subLabel?: string;
  children?: Array<NavItem>;
  href?: string;
}

const NAV_ITEMS: Array<NavItem> = [
  {
    label: "創作譜面",
    children: [
      {
        label: "譜面一覧",
        subLabel: "投稿された譜面の一覧や検索",
        href: "#",
      },
      {
        label: "譜面投稿",
        subLabel: "譜面投稿について",
        href: "#",
      },
    ],
  },
  {
    label: "段位システム",
    children: [
      {
        label: "段位システムについて",
        subLabel: "段位システムとは？",
        href: "#",
      },
      {
        label: "昇格試験",
        subLabel: "昇格試験について",
        href: "#",
      },
    ],
  },
  {
    label: "イベント",
    children: [
      {
        label: "イベント一覧",
        subLabel: "過去・開催中のイベントについて",
      },
    ],
  },
  {
    label: "譜面企画部より",
    children: [
      {
        label: "メンバー紹介",
        subLabel: "譜面企画部のメンバーを紹介します",
        href: "#",
      },
      {
        label: "Q&A",
        subLabel: "譜面企画部についてのQ&A",
        href: "#",
      },
    ],
  },
];
