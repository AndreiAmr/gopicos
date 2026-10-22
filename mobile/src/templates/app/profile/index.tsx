import { RefreshControl, ScrollView } from 'react-native';
import { LogOut, Pencil } from 'lucide-react-native';
import { View, useTheme } from 'tamagui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Avatar,
  EmptyState,
  SettingsGroup,
  SettingsRow,
  Skeleton,
  Text,
} from '../../../atomic/ds';
import { space } from '../../../config/tamagui/tokens';
import { fullName, memberSince, profileStrings } from './logic';
import { useProfileHome } from './useProfileHome';

// Altura da TabBar flutuante (60) usada para não cobrir o último item.
const TAB_BAR_HEIGHT = 60;

const SectionHeader = ({ label }: { label: string }) => (
  <Text
    variant="label"
    tone="muted"
    accessibilityRole="header"
    marginBottom={space[2]}
  >
    {label}
  </Text>
);

const ProfileSkeleton = () => (
  <View alignItems="center" gap={space[2]} testID="profile-skeleton">
    <Skeleton shape="circle" width={96} height={96} />
    <Skeleton width={180} height={26} />
    <Skeleton width={220} height={20} />
    <Skeleton width={140} height={16} />
  </View>
);

export const ProfileTemplate = () => {
  const insets = useSafeAreaInsets();
  const theme = useTheme();
  const {
    profile,
    loading,
    hasError,
    refreshing,
    refresh,
    goToEdit,
    confirmLogout,
  } = useProfileHome();

  return (
    <View flex={1} backgroundColor="$bg">
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: space[4],
          paddingTop: insets.top + space[4],
          paddingBottom: TAB_BAR_HEIGHT + insets.bottom + space[6],
          gap: space[6],
        }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refresh}
            tintColor={theme.primary.val}
          />
        }
      >
        <Text variant="h2" align="center" accessibilityRole="header">
          {profileStrings.title}
        </Text>

        {loading ? <ProfileSkeleton /> : null}

        {hasError ? (
          <EmptyState
            kind="error"
            title={profileStrings.loadError}
            actionLabel={profileStrings.retry}
            onActionPress={refresh}
            testID="profile-error"
          />
        ) : null}

        {profile ? (
          <View alignItems="center" gap={space[1]} testID="profile-header">
            <Avatar
              size="xl"
              firstName={profile.firstName}
              lastName={profile.lastName}
            />
            <Text
              variant="h1"
              align="center"
              numberOfLines={2}
              marginTop={space[2]}
              accessibilityLabel={fullName(profile.firstName, profile.lastName)}
            >
              {fullName(profile.firstName, profile.lastName)}
            </Text>
            <Text variant="body" tone="muted" align="center">
              {profile.email}
            </Text>
            <Text variant="caption" tone="muted" align="center">
              {memberSince(profile.createdAt)}
            </Text>
          </View>
        ) : null}

        <View>
          <SectionHeader label={profileStrings.account} />
          <SettingsGroup>
            <SettingsRow
              icon={Pencil}
              label={profileStrings.editRow}
              value={
                profile
                  ? fullName(profile.firstName, profile.lastName)
                  : undefined
              }
              onPress={goToEdit}
              disabled={!profile}
              isLast
              testID="profile-edit-row"
            />
          </SettingsGroup>
        </View>

        <SettingsGroup>
          <SettingsRow
            icon={LogOut}
            label={profileStrings.logout}
            onPress={confirmLogout}
            chevron={false}
            isLast
            testID="profile-logout-row"
          />
        </SettingsGroup>
      </ScrollView>
    </View>
  );
};
