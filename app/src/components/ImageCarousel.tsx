import React, { useRef, useEffect } from "react";
import {
  View,
  Animated,
  StyleSheet,
  Dimensions,
  ImageSourcePropType,
  FlatList,
} from "react-native";

type ImageData = {
  readonly id: string;
  readonly source: ImageSourcePropType;
};

type Props = {
  readonly imageSources: readonly ImageData[];
  readonly widthPercent?: number;
  readonly height?: number;
};

export const ImageCarousel = ({
  imageSources,
  height,
  widthPercent,
}: Props) => {
  const { width } = Dimensions.get("window");
  const ITEM_SIZE = width * 0.7;
  const SPACING = 20;
  const scrollX = useRef(new Animated.Value(0)).current;
  const flatListRef = useRef<FlatList<any>>(null);
  const currentIndex = useRef(1);

  const styles = StyleSheet.create({
    carouselContainer: {
      height: height ?? ITEM_SIZE,
      justifyContent: "center",
      alignItems: "center",
    },
    imageContainer: {
      borderRadius: 15,
      overflow: "hidden",
      marginHorizontal: SPACING,
    },
    image: {
      width: widthPercent ? `${widthPercent}%` : ITEM_SIZE,
      height: height ?? ITEM_SIZE * 0.75,
    },
    dotsContainer: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      marginTop: 10,
    },
    dot: {
      height: 8,
      width: 8,
      borderRadius: 4,
      backgroundColor: "#333",
      marginHorizontal: 4,
    },
  });

  useEffect(() => {
    const interval = setInterval(() => {
      if (currentIndex.current < imageSources.length - 1) {
        currentIndex.current += 1;
      } else {
        currentIndex.current = 0;
      }
      flatListRef.current?.scrollToOffset({
        offset: currentIndex.current * (ITEM_SIZE + SPACING * 2),
        animated: true,
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [imageSources.length]);

  return (
    <View style={styles.carouselContainer}>
      <Animated.FlatList
        ref={flatListRef}
        data={imageSources}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          alignItems: "center",
          justifyContent: "center",
        }}
        snapToInterval={ITEM_SIZE + SPACING * 2}
        decelerationRate="fast"
        bounces={false}
        initialScrollIndex={1}
        getItemLayout={(data, index) => ({
          length: ITEM_SIZE + SPACING * 2,
          offset: (ITEM_SIZE + SPACING * 2) * index,
          index,
        })}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: true }
        )}
        onMomentumScrollEnd={(event) => {
          const index = Math.round(
            event.nativeEvent.contentOffset.x / (ITEM_SIZE + SPACING * 2)
          );
          currentIndex.current = index;
        }}
        renderItem={({ item, index }) => {
          const inputRange = [
            (index - 1) * (ITEM_SIZE + SPACING * 2),
            index * (ITEM_SIZE + SPACING * 2),
            (index + 1) * (ITEM_SIZE + SPACING * 2),
          ];

          const scale = scrollX.interpolate({
            inputRange,
            outputRange: [0.8, 1, 0.8],
            extrapolate: "clamp",
          });

          const translateX = scrollX.interpolate({
            inputRange,
            outputRange: [-50, 0, 50],
            extrapolate: "clamp",
          });

          const opacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.5, 1, 0.5],
            extrapolate: "clamp",
          });

          const blurRadius = scrollX.interpolate({
            inputRange,
            outputRange: [8, 0, 8],
            extrapolate: "clamp",
          });

          return (
            <Animated.View
              style={[
                styles.imageContainer,
                {
                  width: widthPercent
                    ? width * (widthPercent / 100)
                    : ITEM_SIZE,
                  transform: [{ scale }, { translateX }],
                  opacity,
                },
              ]}
            >
              <Animated.Image
                source={item.source}
                style={styles.image}
                blurRadius={blurRadius}
                resizeMode="cover"
              />
            </Animated.View>
          );
        }}
      />

      <View style={styles.dotsContainer}>
        {imageSources.map((_, index) => {
          const inputRange = [
            (index - 1) * (ITEM_SIZE + SPACING * 2),
            index * (ITEM_SIZE + SPACING * 2),
            (index + 1) * (ITEM_SIZE + SPACING * 2),
          ];

          const dotOpacity = scrollX.interpolate({
            inputRange,
            outputRange: [0.3, 1, 0.3],
            extrapolate: "clamp",
          });

          const dotScale = scrollX.interpolate({
            inputRange,
            outputRange: [0.8, 1.4, 0.8],
            extrapolate: "clamp",
          });

          return (
            <Animated.View
              key={index.toString()}
              style={[
                styles.dot,
                {
                  opacity: dotOpacity,
                  transform: [{ scale: dotScale }],
                },
              ]}
            />
          );
        })}
      </View>
    </View>
  );
};
