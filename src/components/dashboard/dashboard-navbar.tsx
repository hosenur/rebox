"use client";
import {
  ChevronDownIcon,
  MagnifyingGlassIcon,
  ShoppingBagIcon,
} from "@heroicons/react/24/outline";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Link } from "@/components/ui/link";
import { Menu, MenuContent, MenuItem } from "@/components/ui/menu";
import {
  Navbar,
  NavbarGap,
  NavbarItem,
  NavbarMobile,
  type NavbarProps,
  NavbarProvider,
  NavbarSection,
  NavbarSeparator,
  NavbarSpacer,
  NavbarStart,
  NavbarTrigger,
} from "@/components/ui/navbar";
import { Separator } from "@/components/ui/separator";
import { ThemeSwitcher } from "@/components/theme-switcher";

const categories = [
  { id: 1, label: "Electronics", url: "#" },
  { id: 2, label: "Fashion", url: "#" },
  { id: 3, label: "Home & Kitchen", url: "#" },
  { id: 4, label: "Sports", url: "#" },
  { id: 5, label: "Books", url: "#" },
  { id: 6, label: "Beauty & Personal Care", url: "#" },
  { id: 7, label: "Grocery", url: "#" },
  { id: 8, label: "Toys & Games", url: "#" },
  { id: 9, label: "Automotive", url: "#" },
  { id: 10, label: "Health & Wellness", url: "#" },
];

export default function DashboardNavbar(props: NavbarProps) {
  return (
    <NavbarProvider>
      <Navbar {...props}>
        <NavbarStart>
          <Link
            className="flex items-center gap-x-2 font-medium"
            aria-label="Goto documentation of Navbar"
            href="/"
          >
            <Avatar
              isSquare
              size="sm"
              className="outline-hidden"
              src="https://design.intentui.com/logo?color=155DFC"
            />
            <span>
              Intent <span className="text-muted-fg">UI</span>
            </span>
          </Link>
        </NavbarStart>
        <NavbarGap />
        <NavbarSection>
          <NavbarItem href="/" isCurrent>
            Overview
          </NavbarItem>
          <NavbarItem href="/projects">Projects</NavbarItem>
          <NavbarItem href="/databases">Databases</NavbarItem>
          <NavbarItem href="/apps">Apps</NavbarItem>
          <Menu>
            <NavbarItem>
              Categories
              <ChevronDownIcon className="col-start-3" />
            </NavbarItem>
            <MenuContent
              className="min-w-(--trigger-width) sm:min-w-56"
              items={categories}
            >
              {(item) => (
                <MenuItem id={item.id} textValue={item.label} href={item.url}>
                  {item.label}
                </MenuItem>
              )}
            </MenuContent>
          </Menu>
        </NavbarSection>
        <NavbarSpacer />
        <NavbarSection className="max-md:hidden">
          <Button intent="plain" size="sq-sm" aria-label="Search for products">
            <MagnifyingGlassIcon />
          </Button>
          <Button intent="plain" size="sq-sm" aria-label="Your Bag">
            <ShoppingBagIcon />
          </Button>
          <ThemeSwitcher />
          <Separator orientation="vertical" className="mr-3 ml-1 h-5" />
        </NavbarSection>
      </Navbar>
      <NavbarMobile>
        <NavbarTrigger />
        <NavbarSpacer />
        <Button intent="plain" size="sq-sm" aria-label="Search for products">
          <MagnifyingGlassIcon />
        </Button>
        <Button intent="plain" size="sq-sm" aria-label="Your Bag">
          <ShoppingBagIcon />
        </Button>
        <ThemeSwitcher />
        <NavbarSeparator className="mr-2.5" />
      </NavbarMobile>
    </NavbarProvider>
  );
}
