import { MapPin, User, Plus, LucideIcon } from 'lucide-react-native';
import { Route } from '../../routeTypes';

type TabInfoProps = {
  label: string;
  Icon: LucideIcon;
  /** Rótulo de acessibilidade quando difere do visível. */
  a11yLabel?: string;
};

const HomeTabInfo: TabInfoProps = {
  label: 'Mapa',
  Icon: MapPin,
};

const ProfileTabInfo: TabInfoProps = {
  label: 'Perfil',
  Icon: User,
};

const NewSpotTabInfo: TabInfoProps = {
  label: 'Novo pico',
  Icon: Plus,
  a11yLabel: 'Cadastrar novo pico',
};

export const tabInfoMapper = new Map<string, TabInfoProps>([
  [Route.Home, HomeTabInfo],
  [Route.Profile, ProfileTabInfo],
  [Route.NewSpot, NewSpotTabInfo],
]);

/** Telas de formulário do Perfil: a TabBar some para dar espaço ao teclado (UX-P4). */
export const PROFILE_FORM_SCREENS = ['ProfileEdit', 'ChangePassword', 'DeleteAccount'];

export const shouldHideTabBar = (focusedRouteName?: string): boolean =>
  focusedRouteName !== undefined &&
  PROFILE_FORM_SCREENS.includes(focusedRouteName);
