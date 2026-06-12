import React from "react";
import { Dimensions } from "react-native";
import Svg, { Defs, Mask, Rect } from "react-native-svg";

const { width, height } = Dimensions.get("window");

interface Props {
    scannerWidth: number;
    scannerHeight: number;
    scannerTop: number;
    radius?: number;
}

export default function ScannerMask({
    scannerWidth,
    scannerHeight,
    scannerTop,
    radius = 24,
}: Props) {
    const left = (width - scannerWidth) / 2;

    return (
        <Svg
            width={width}
            height={height}
            style={{
                position: "absolute",
            }}
        >
            <Defs>
                <Mask id="mask">
                    {/* area terlihat */}
                    <Rect
                        x="0"
                        y="0"
                        width={width}
                        height={height}
                        fill="white"
                    />

                    {/* area scanner menjadi transparan */}
                    <Rect
                        x={left}
                        y={scannerTop}
                        width={scannerWidth}
                        height={scannerHeight}
                        rx={radius}
                        ry={radius}
                        fill="black"
                    />
                </Mask>
            </Defs>

            <Rect
                x="0"
                y="0"
                width={width}
                height={height}
                fill="rgba(0,0,0,0.65)"
                mask="url(#mask)"
            />
        </Svg>
    );
}