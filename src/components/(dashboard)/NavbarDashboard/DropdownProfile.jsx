import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getSession } from "@/lib/getSession";

export async function DropdownProfile() {
  const session = await getSession();
  const user = session?.user;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <AvatarProfile user={user} />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            Profile
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Billing
            <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Settings
            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Keyboard shortcuts
            <DropdownMenuShortcut>⌘K</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>Team</DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>Invite users</DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuItem>Email</DropdownMenuItem>
                <DropdownMenuItem>Message</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>More...</DropdownMenuItem>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
          <DropdownMenuItem>
            New Team
            <DropdownMenuShortcut>⌘+T</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

const AvatarProfile = ({ user }) => {

  return (
    <div className="flex items-center gap-2 hover:cursor-pointer">
      <div>
        <p className="text-sm font-medium capitalize leading-none tracking-tight text-foreground md:text-base md:font-semibold md:leading-normal md:tracking-normal">
          {user.name ? user.name : `${user.firstName} ${user.lastName}`}
        </p>
        <p className="text-xs font-normal leading-none tracking-tight text-muted-foreground">
          {user?.email}
        </p>
      </div>
      <Avatar>
        {user?.image ? (
          <AvatarImage
            src={user.image}
            alt={`${user.firstName} ${user.lastName}`}
            className="h-10 w-10 rounded-full"
          />
        ) : (
          [...Array(8)].map((_, i) => (
            <AvatarImage
              key={i}
              src={`https://api.dicebear.com/9.x/adventurer/svg?seed=Loki-${i + 1}.jpg`}
              alt={`Friend ${i + 1}`}
              className="h-10 w-10 rounded-full"
            />
          ))
        )}
        <AvatarFallback></AvatarFallback>
      </Avatar>
    </div>
  );
};
