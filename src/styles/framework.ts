import { StyleSheet } from 'react-native';
import colors from './colors';
import { NamedStyles } from '../types/variables';

const backgrounds: NamedStyles<any> = {
  bgPrimary: { backgroundColor: colors.primary },
  bgSecondary: { backgroundColor: colors.secondary },
  bgDanger: { backgroundColor: colors.danger },
  bgSuccess: { backgroundColor: colors.success },
  bgWarning: { backgroundColor: colors.warning },
  bgLight: { backgroundColor: colors.light },
  bgDark: { backgroundColor: colors.dark },
  bgLayout: { backgroundColor: colors.layout }
};

const spacing: NamedStyles<any> = {
  m0: { margin: 0 },
  m1: { margin: 4 },
  m2: { margin: 8 },
  m3: { margin: 12 },
  m4: { margin: 16 },
  m5: { margin: 20 },

  mt0: { marginTop: 0 },
  mt1: { marginTop: 4 },
  mt2: { marginTop: 8 },
  mt3: { marginTop: 12 },
  mt4: { marginTop: 16 },
  mt5: { marginTop: 20 },

  mb0: { marginBottom: 0 },
  mb1: { marginBottom: 4 },
  mb2: { marginBottom: 8 },
  mb3: { marginBottom: 12 },
  mb4: { marginBottom: 16 },
  mb5: { marginBottom: 20 },

  ml0: { marginLeft: 0 },
  ml1: { marginLeft: 4 },
  ml2: { marginLeft: 8 },
  ml3: { marginLeft: 12 },
  ml4: { marginLeft: 16 },
  ml5: { marginLeft: 20 },

  mr0: { marginRight: 0 },
  mr1: { marginRight: 4 },
  mr2: { marginRight: 8 },
  mr3: { marginRight: 12 },
  mr4: { marginRight: 16 },
  mr5: { marginRight: 20 },

  mx0: { marginHorizontal: 0 },
  mx1: { marginHorizontal: 4 },
  mx2: { marginHorizontal: 8 },
  mx3: { marginHorizontal: 12 },
  mx4: { marginHorizontal: 16 },
  mx5: { marginHorizontal: 20 },

  my0: { marginVertical: 0 },
  my1: { marginVertical: 4 },
  my2: { marginVertical: 8 },
  my3: { marginVertical: 12 },
  my4: { marginVertical: 16 },
  my5: { marginVertical: 20 },

  p0: { padding: 0 },
  p1: { padding: 4 },
  p2: { padding: 8 },
  p3: { padding: 12 },
  p4: { padding: 16 },
  p5: { padding: 20 },

  pt0: { paddingTop: 0 },
  pt1: { paddingTop: 4 },
  pt2: { paddingTop: 8 },
  pt3: { paddingTop: 12 },
  pt4: { paddingTop: 16 },
  pt5: { paddingTop: 20 },

  pb0: { paddingBottom: 0 },
  pb1: { paddingBottom: 4 },
  pb2: { paddingBottom: 8 },
  pb3: { paddingBottom: 12 },
  pb4: { paddingBottom: 16 },
  pb5: { paddingBottom: 20 },

  pl0: { paddingLeft: 0 },
  pl1: { paddingLeft: 4 },
  pl2: { paddingLeft: 8 },
  pl3: { paddingLeft: 12 },
  pl4: { paddingLeft: 16 },
  pl5: { paddingLeft: 20 },

  pr0: { paddingRight: 0 },
  pr1: { paddingRight: 4 },
  pr2: { paddingRight: 8 },
  pr3: { paddingRight: 12 },
  pr4: { paddingRight: 16 },
  pr5: { paddingRight: 20 },

  px0: { paddingHorizontal: 0 },
  px1: { paddingHorizontal: 4 },
  px2: { paddingHorizontal: 8 },
  px3: { paddingHorizontal: 12 },
  px4: { paddingHorizontal: 16 },
  px5: { paddingHorizontal: 20 },

  py0: { paddingVertical: 0 },
  py1: { paddingVertical: 4 },
  py2: { paddingVertical: 8 },
  py3: { paddingVertical: 12 },
  py4: { paddingVertical: 16 },
  py5: { paddingVertical: 20 },

  gap0: { gap: 0 },
  gap1: { gap: 4 },
  gap2: { gap: 8 },
  gap3: { gap: 12 },
  gap4: { gap: 16 },
  gap5: { gap: 20 },

  rowGap0: { rowGap: 0 },
  rowGap1: { rowGap: 4 },
  rowGap2: { rowGap: 8 },
  rowGap3: { rowGap: 12 },
  rowGap4: { rowGap: 16 },
  rowGap5: { rowGap: 20 },

  columnGap0: { columnGap: 0 },
  columnGap1: { columnGap: 4 },
  columnGap2: { columnGap: 8 },
  columnGap3: { columnGap: 12 },
  columnGap4: { columnGap: 16 },
  columnGap5: { columnGap: 20 },
};

const layout: NamedStyles<any> = {
  flexCenter: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  flexOne: {
    flex: 1
  },
  justifyCenter: {
    justifyContent: "center",
  },
  justifyBetween: {
    justifyContent: "space-between"
  },
  overflowHidden: {
    overflow: "hidden"
  },
  flexRow: {
    flexDirection: "row"
  },
  alignCenter: {
    alignItems: "center"
  },
  dFlex: {
    display: "flex"
  },
  dNone: {
    display: "none"
  }
};

const borders: NamedStyles<any> = {
  border: { borderWidth: 1, borderColor: colors.border },
  border0: { borderWidth: 0 },
  border1: { borderWidth: 1 },
  border2: { borderWidth: 2 },
  border3: { borderWidth: 3 },

  borderPrimary: { borderColor: colors.primary },
  borderSecondary: { borderColor: colors.secondary },
  borderDanger: { borderColor: colors.danger },
  borderSuccess: { borderColor: colors.success },
  borderDark: { borderColor: colors.dark },
  borderLight: { borderColor: colors.light },
  borderGray: { borderColor: colors.gray },

  borderTop: { borderTopWidth: 1, borderColor: colors.border },
  borderTop0: { borderTopWidth: 0 },
  borderTop1: { borderTopWidth: 1 },
  borderTop2: { borderTopWidth: 2 },
  borderTop3: { borderTopWidth: 3 },

  borderRight: { borderRightWidth: 1, borderColor: colors.border },
  borderRight0: { borderRightWidth: 0 },
  borderRight1: { borderRightWidth: 1 },
  borderRight2: { borderRightWidth: 2 },
  borderRight3: { borderRightWidth: 3 },

  borderBottom: { borderBottomWidth: 1, borderColor: colors.border },
  borderBottom0: { borderBottomWidth: 0 },
  borderBottom1: { borderBottomWidth: 1 },
  borderBottom2: { borderBottomWidth: 2 },
  borderBottom3: { borderBottomWidth: 3 },

  borderLeft: { borderLeftWidth: 1, borderColor: colors.border },
  borderLeft0: { borderLeftWidth: 0 },
  borderLeft1: { borderLeftWidth: 1 },
  borderLeft2: { borderLeftWidth: 2 },
  borderLeft3: { borderLeftWidth: 3 },

  borderTopPrimary: { borderTopColor: colors.primary },
  borderTopSecondary: { borderTopColor: colors.secondary },
  borderTopDanger: { borderTopColor: colors.danger },
  borderTopSuccess: { borderTopColor: colors.success },
  borderTopDark: { borderTopColor: colors.dark },
  borderTopLight: { borderTopColor: colors.light },
  borderTopGray: { borderTopColor: colors.gray },

  borderRightPrimary: { borderRightColor: colors.primary },
  borderRightSecondary: { borderRightColor: colors.secondary },
  borderRightDanger: { borderRightColor: colors.danger },
  borderRightSuccess: { borderRightColor: colors.success },
  borderRightDark: { borderRightColor: colors.dark },
  borderRightLight: { borderRightColor: colors.light },
  borderRightGray: { borderRightColor: colors.gray },

  borderBottomPrimary: { borderBottomColor: colors.primary },
  borderBottomSecondary: { borderBottomColor: colors.secondary },
  borderBottomDanger: { borderBottomColor: colors.danger },
  borderBottomSuccess: { borderBottomColor: colors.success },
  borderBottomDark: { borderBottomColor: colors.dark },
  borderBottomLight: { borderBottomColor: colors.light },
  borderBottomGray: { borderBottomColor: colors.gray },

  borderLeftPrimary: { borderLeftColor: colors.primary },
  borderLeftSecondary: { borderLeftColor: colors.secondary },
  borderLeftDanger: { borderLeftColor: colors.danger },
  borderLeftSuccess: { borderLeftColor: colors.success },
  borderLeftDark: { borderLeftColor: colors.dark },
  borderLeftLight: { borderLeftColor: colors.light },
  borderLeftGray: { borderLeftColor: colors.gray },
};

const shadows: NamedStyles<any> = {
  shadowNone: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  shadowLight: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  shadowMedium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  shadowStrong: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  shadowHeavy: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 10,
  },
};

const radii: NamedStyles<any> = {
  roundedSm: { borderRadius: 4 },
  rounded: { borderRadius: 8 },
  roundedMd: { borderRadius: 12 },
  roundedLg: { borderRadius: 16 },
  roundedPill: { borderRadius: 50 },
  roundedCircle: {
    borderRadius: 9999,
    aspectRatio: 1,
  },

  roundedTopSm: {
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  roundedTop: {
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  roundedTopMd: {
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  roundedTopLg: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },

  roundedBottomSm: {
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
  },
  roundedBottom: {
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  roundedBottomMd: {
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  roundedBottomLg: {
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },

  roundedStartSm: {
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
  },
  roundedStart: {
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
  },
  roundedStartMd: {
    borderTopLeftRadius: 12,
    borderBottomLeftRadius: 12,
  },
  roundedStartLg: {
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },

  roundedEndSm: {
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
  },
  roundedEnd: {
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
  },
  roundedEndMd: {
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
  },
  roundedEndLg: {
    borderTopRightRadius: 16,
    borderBottomRightRadius: 16,
  },
};

const textFormat: NamedStyles<any> = {
  textCenter: {
    textAlign: "center"
  },
  textCapitalize: {
    textTransform: "capitalize"
  }
}

const textWeights: NamedStyles<any> = {
  fontThin: { fontWeight: '100' },
  fontLight: { fontWeight: '300' },
  fontRegular: { fontWeight: '400' },
  fontMedium: { fontWeight: '500' },
  fontSemiBold: { fontWeight: '600' },
  fontBold: { fontWeight: '700' },
  fontExtraBold: { fontWeight: '800' },
};

const textSizes: NamedStyles<any> = {
  textXs: { fontSize: 12 },
  textSm: { fontSize: 14 },
  textBase: { fontSize: 16 },
  textLg: { fontSize: 18 },
  textXl: { fontSize: 20 },
  text2xl: { fontSize: 24 },
  text3xl: { fontSize: 30 },
};

const textColors: NamedStyles<any> = {
  textPrimary: { color: colors.primary },
  textSecondary: { color: colors.secondary },
  textDanger: { color: colors.danger },
  textSuccess: { color: colors.success },
  textMuted: { color: colors.muted },
  textDark: { color: colors.dark },
  textWhite: { color: colors.white },
  textGray: { color: colors.gray },
};

const positions: NamedStyles<any> = {
  relative: { position: "relative" },
  absolute: { position: "absolute" },
  static: { position: "static" },

  top0: { top: 0 },
  top1: { top: 4 },
  top2: { top: 8 },
  top3: { top: 12 },
  top4: { top: 16 },
  top5: { top: 20 },

  right0: { right: 0 },
  right1: { right: 4 },
  right2: { right: 8 },
  right3: { right: 12 },
  right4: { right: 16 },
  right5: { right: 20 },

  bottom0: { bottom: 0 },
  bottom1: { bottom: 4 },
  bottom2: { bottom: 8 },
  bottom3: { bottom: 12 },
  bottom4: { bottom: 16 },
  bottom5: { bottom: 20 },

  left0: { left: 0 },
  left1: { left: 4 },
  left2: { left: 8 },
  left3: { left: 12 },
  left4: { left: 16 },
  left5: { left: 20 },

  indexBehind: { zIndex: -1 },
  indexTop: { zIndex: 1001 },
}

const components: NamedStyles<any> = {
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 14,
    fontSize: 16,
  },
  textArea: {
    height: 80,
    verticalAlign: 'top'
  },
  card: {
    backgroundColor: colors.light,
    padding: 16,
    borderRadius: 12,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  }
}

const framework = StyleSheet.create({
  ...spacing,
  ...textSizes,
  ...backgrounds,
  ...textColors,
  ...layout,
  ...textFormat,
  ...borders,
  ...radii,
  ...textWeights,
  ...shadows,
  ...components,
  ...positions
});

export default framework;
