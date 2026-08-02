import React from 'react';
import { Text, useTheme, View } from 'tamagui';
import { LucideProps } from 'lucide-react-native';

type IconType = React.ForwardRefExoticComponent<
  LucideProps & React.RefAttributes<SVGSVGElement>
>;

type Variant = 'orange' | 'green';

type ColorVariantProps = {
  bg: string;
  fill: string;
  color: string;
};

type FilterInfoProps = {
  numberHighlight: number;
  description: string;
  Icon: IconType;
  variant: Variant;
  fillIcon?: boolean;
};

export const FilterInfo = ({
  numberHighlight,
  description,
  Icon,
  variant,
  fillIcon = false,
}: FilterInfoProps) => {
  const theme = useTheme();

  const variants: Record<Variant, ColorVariantProps> = {
    green: {
      bg: theme.green2.val,
      fill: theme.green10.val,
      color: theme.green10.val,
    },
    orange: {
      bg: theme.orange2.val,
      fill: theme.orange10.val,
      color: theme.orange10.val,
    },
  };

  return (
    <View
      flexDirection="row"
      alignItems="center"
      height="100%"
      padding={10}
      gap="$2"
    >
      <View bg={variants[variant].bg} padding={12} borderRadius="50%">
        <Icon
          fill={fillIcon ? variants[variant].fill : 'transparent'}
          color={variants[variant].color}
          size={14}
        />
      </View>
      <View>
        <Text color="$accent1" fontSize="$4" fontWeight="bold">
          {numberHighlight}
        </Text>
        <Text color="$neutral3" fontSize="$3">
          {description}
        </Text>
      </View>
    </View>
  );
};
