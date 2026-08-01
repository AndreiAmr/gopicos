import { MapPin, User, Plus, LucideIcon } from 'lucide-react-native';
import { Route } from '../../routeTypes';

type TabInfoProps = {
  label: string;
  Icon: LucideIcon;
};

const defaultIconSize = 15;

const HomeTabInfo: TabInfoProps = {
  label: 'Mapa',
  Icon: MapPin,
};

const ProfileTabInfo: TabInfoProps = {
  label: 'Perfil',
  Icon: User,
};

const NewSpotTabInfo: TabInfoProps = {
  label: 'Novo Pico',
  Icon: Plus,
};

export const tabInfoMapper = new Map<string, TabInfoProps>([
  [Route.Home, HomeTabInfo],
  [Route.Profile, ProfileTabInfo],
  [Route.NewSpot, NewSpotTabInfo],
]);
