import React, { Children, isValidElement, ReactElement, useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Platform } from 'react-native';
import { MainColors } from '@/constants';
import Animated, {
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

interface TabProps {
  label: string;
  icon: React.ReactNode;
  badge?: number;
  children: React.ReactNode;
}

export const Tab: React.FC<TabProps> = ({ children }) => {
  return <>{children}</>;
};

interface TabsComponentProps {
  children: React.ReactNode;
  activeTab?: number;
  onTabChange?: (index: number) => void;
  containerStyle?: any;
  tabBarStyle?: any;
}

const TabIcon: React.FC<{ focused: boolean; icon: React.ReactNode }> = ({ focused, icon }) => {
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: withSpring(focused ? 1.2 : 1, {
            damping: 10,
            stiffness: 100,
          }),
        },
      ],
      opacity: withTiming(focused ? 1 : 0.5, { duration: 200 }),
    };
  });

  return (
    <Animated.View style={[styles.iconContainer, animatedStyle]}>
      {icon}
    </Animated.View>
  );
};

export const TabsComponent: React.FC<TabsComponentProps> = ({
  children,
  activeTab = 0,
  onTabChange,
  containerStyle,
  tabBarStyle,
}) => {
  const [activeIndex, setActiveIndex] = useState(activeTab);

  const tabs = Children.toArray(children).filter(
    (child): child is ReactElement<TabProps> => isValidElement(child) && child.type === Tab
  );

  const handleTabPress = (index: number) => {
    setActiveIndex(index);
    onTabChange?.(index);
  };

  return (
    <View style={[styles.container, containerStyle]}>
      <View style={[styles.tabBar, tabBarStyle]}>
        {tabs.map((tab, index) => {
          const isFocused = activeIndex === index;
          const { icon, label, badge } = tab.props;

          return (
            <TouchableOpacity
              key={index}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              onPress={() => handleTabPress(index)}
              style={styles.tabButton}
            >
              <TabIcon focused={isFocused} icon={icon} />
              {isFocused && <View style={styles.activeIndicator} />}
              {badge ? (
                <View style={styles.badgeContainer}>
                  <Text style={styles.badgeText}>{badge}</Text>
                </View>
              ) : null}
            </TouchableOpacity>
          );
        })}
      </View>
      <View style={styles.content}>
        {tabs[activeIndex]?.props.children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: MainColors.white,
    borderRadius: 32,
    height: 64,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'space-around',
    marginHorizontal: 16,
    marginBottom: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowOpacity: 0.1,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: 48,
    position: 'relative',
  },
  iconContainer: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeIndicator: {
    position: 'absolute',
    bottom: 0,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: MainColors.herbery_honey,
  },
  content: {
    flex: 1,
  },
  badgeContainer: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: MainColors.herbery_honey,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  badgeText: {
    color: MainColors.white,
    fontSize: 12,
    fontWeight: '600',
  },
}); 