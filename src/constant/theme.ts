import { Dimensions } from 'react-native';
import { Colors, Spacings, Typography } from 'react-native-ui-lib';

const { width } = Dimensions.get('window');
const isSmallScreen = width < 375;

export const setupTheme = () => {
  Colors.loadColors({
    primary: '#009DDC',
    secondary: '#FFD700',
    danger: '#A71D31',
    white: '#FFFFFF',
    black: '#000000',
    gray: '#95A5A6',
  });

  Typography.loadTypographies({
    h1: { fontSize: 28, fontWeight: '700', lineHeight: 34 },
    h2: { fontSize: 22, fontWeight: '700', lineHeight: 28 },
    h3: { fontSize: 20, fontWeight: '700', lineHeight: 24 },
    boldTitle: { fontSize: 34, fontweight: '700', lineHeight: 41 },
    boldBody: { fontSize: 17, fontweight: '700', lineHeight: 22 },
    boldSubheading: { fontSize: 15, fontweight: '700', lineHeight: 20 },
    boldFootnote: { fontSize: 13, fontweight: '700', lineHeight: 18 },
    boldCapt: { fontSize: 12, fontweight: '700', lineHeight: 16 },
    MediumTitle: { fontSize: 34, fontweight: '500', lineHeight: 41 },
    MediumBody: { fontSize: 17, fontweight: '500', lineHeight: 22 },
    MediumSubheading: { fontSize: 15, fontweight: '500', lineHeight: 20 },
    MediumFootnote: { fontSize: 13, fontweight: '500', lineHeight: 18 },
    MediumCapt: { fontSize: 12, fontweight: '500', lineHeight: 16 },
    RegularTitle: { fontSize: 34, fontweight: '400', lineHeight: 41 },
    RegularBody: { fontSize: 17, fontweight: '400', lineHeight: 22 },
    RegularSubheading: { fontSize: 15, fontweight: '400', lineHeight: 20 },
    RegularFootnote: { fontSize: 13, fontweight: '400', lineHeight: 18 },
    RegularCapt: { fontSize: 12, fontweight: '400', lineHeight: 16 },
  });

  Spacings.loadSpacings({
    page: isSmallScreen ? 16 : 20,
  });
};
