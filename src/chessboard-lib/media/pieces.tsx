import React from "react";
import { Circle, G, Path, Svg } from "react-native-svg";

export const wP = () => (
    <Svg width={45} height={45} viewBox="0 0 45 45">
    <Path
      d="M22.5 9c-2.21 0-4 1.79-4 4 0 .89.29 1.71.78 2.38C17.33 16.5 16 18.59 16 21c0 2.03.94 3.84 2.41 5.03-3 1.06-7.41 5.55-7.41 13.47h23c0-7.92-4.41-12.41-7.41-13.47 1.47-1.19 2.41-3 2.41-5.03 0-2.41-1.33-4.5-3.28-5.62.49-.67.78-1.49.78-2.38 0-2.21-1.79-4-4-4z"
      fill="#fff"
      fillOpacity={1}
      fillRule="nonzero"
      stroke="#000"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="miter"
      strokeMiterlimit={4}
      strokeDasharray="none"
      strokeOpacity={1}
    />
  </Svg>
);

export const wR = () => (
      <Svg width={45} height={45} viewBox="0 0 45 45">
        <G
          style={{
            opacity: 1,
            fill: "#fff",
            fillOpacity: 1,
            fillRule: "evenodd",
            stroke: "#000",
            strokeWidth: 1.5,
            strokeLinecap: "round",
            strokeLinejoin: "round",
            strokeMiterlimit: 4,
            strokeDasharray: "none",
            strokeOpacity: 1,
          }}
        >
          <Path
            d="M9 39h27v-3H9v3zM12 36v-4h21v4H12zM11 14V9h4v2h5V9h5v2h5V9h4v5"
            strokeLinecap="butt"
          />
          <Path d="m34 14-3 3H14l-3-3" />
          <Path
            d="M31 17v12.5H14V17"
            strokeLinecap="butt"
            strokeLinejoin="miter"
          />
          <Path d="m31 29.5 1.5 2.5h-20l1.5-2.5" />
          <Path
            d="M11 14h23"
            fill="none"
            stroke="#000"
            strokeLinejoin="miter"
          />
        </G>
      </Svg>    
);

export const wN = () => (
      <Svg width={45} height={45} viewBox="0 0 45 45">
        <G
            fill="none"
            fillOpacity={1}
            fillRule="evenodd"
            stroke="#000"
            strokeWidth={1.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeMiterlimit={4}
            strokeDasharray="none"
            strokeOpacity={1}
          >
          <Path
            d="M22 10c10.5 1 16.5 8 16 29H15c0-9 10-6.5 8-21"
            fill="#fff"
            stroke="#000"
          />
          <Path
            d="M24 18c.38 2.91-5.55 7.37-8 9-3 2-2.82 4.34-5 4-1.042-.94 1.41-3.04 0-3-1 0 .19 1.23-1 2-1 0-4.003 1-4-4 0-2 6-12 6-12s1.89-1.9 2-3.5c-.73-.994-.5-2-.5-3 1-1 3 2.5 3 2.5h2s.78-1.992 2.5-3c1 0 1 3 1 3"
            fill="#fff"
            stroke="#000"
          />
          <Path
            d="M9.5 25.5a.5.5 0 1 1-1 0 .5.5 0 1 1 1 0z"
            fill="#000"
            stroke="#000"
          />
          <Path
            d="M15 15.5a.5 1.5 0 1 1-1 0 .5 1.5 0 1 1 1 0z"
            fill="#000"
            stroke="#000"
            transform="rotate(30 14.5 15.5)"
          />
        </G>
      </Svg>
    
);

export const wB = () => (
    <Svg width={45} height={45} viewBox="0 0 45 45">
    <G
      fill="none"
      fillOpacity={1}
      fillRule="evenodd"
      stroke="#000"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit={4}
      strokeDasharray="none"
      strokeOpacity={1}
      >
      <G
        fill="#fff"
        stroke="#000"
        strokeLinecap="butt"
      >
        <Path d="M9 36c3.39-.97 10.11.43 13.5-2 3.39 2.43 10.11 1.03 13.5 2 0 0 1.65.54 3 2-.68.97-1.65.99-3 .5-3.39-.97-10.11.46-13.5-1-3.39 1.46-10.11.03-13.5 1-1.35.49-2.32.47-3-.5 1.35-1.46 3-2 3-2z" />
        <Path d="M15 32c2.5 2.5 12.5 2.5 15 0 .5-1.5 0-2 0-2 0-2.5-2.5-4-2.5-4 5.5-1.5 6-11.5-5-15.5-11 4-10.5 14-5 15.5 0 0-2.5 1.5-2.5 4 0 0-.5.5 0 2z" />
        <Path d="M25 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 1 1 5 0z" />
      </G>
      <Path
        d="M17.5 26h10M15 30h15m-7.5-14.5v5M20 18h5"
        fill="none"
        stroke="#000"
        strokeLinejoin="miter"
      />
    </G>
  </Svg>
);

export const wQ = () => (
  <Svg width={45} height={45} viewBox="0 0 45 45">
    {/* Queen body */}
    <Path
      d="M9 26c8.5-1.5 21-1.5 27 0l2.5-12.5L31 25l-.3-14.1-5.2 13.6-3-14.5-3 14.5-5.2-13.6L14 25 6.5 13.5 9 26z"
      fill="#fff"
      stroke="#000"
      strokeWidth={1.5}
      strokeLinejoin="round"
    />
    <Path
      d="M9 26c0 2 1.5 2 2.5 4 1 1.5 1 1 .5 3.5-1.5 1-1 2.5-1 2.5-1.5 1.5 0 2.5 0 2.5 6.5 1 16.5 1 23 0 0 0 1.5-1 0-2.5 0 0 .5-1.5-1-2.5-.5-2.5-.5-2 .5-3.5 1-2 2.5-2 2.5-4-8.5-1.5-18.5-1.5-27 0z"
      fill="#fff"
      stroke="#000"
      strokeWidth={1.5}
      strokeLinejoin="round"
    />
    {/* Detail lines */}
    <Path
      d="M11.5 30c3.5-1 18.5-1 22 0M12 33.5c6-1 15-1 21 0"
      fill="none"
      stroke="#000"
      strokeWidth={1.5}
    />
    {/* Crown circles */}
    <Circle cx={6} cy={12} r={2} fill="#fff" stroke="#000" strokeWidth={1.5} />
    <Circle cx={14} cy={9} r={2} fill="#fff" stroke="#000" strokeWidth={1.5} />
    <Circle cx={22.5} cy={8} r={2} fill="#fff" stroke="#000" strokeWidth={1.5} />
    <Circle cx={31} cy={9} r={2} fill="#fff" stroke="#000" strokeWidth={1.5} />
    <Circle cx={39} cy={12} r={2} fill="#fff" stroke="#000" strokeWidth={1.5} />
  </Svg>
);

export const wK = () => (
<Svg width={45} height={45} viewBox="0 0 45 45">
    <G
      fill="none"
      fillOpacity={1}
      fillRule="evenodd"
      stroke="#000"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit={4}
      strokeDasharray="none"
      strokeOpacity={1}
    >
      <Path
        d="M22.5 11.63V6M20 8h5"
        fill="none"
        stroke="#000"
        strokeLinejoin="miter"
      />
      <Path
        d="M22.5 25s4.5-7.5 3-10.5c0 0-1-2.5-3-2.5s-3 2.5-3 2.5c-1.5 3 3 10.5 3 10.5"
        fill="#fff"
        stroke="#000"
        strokeLinecap="butt"
        strokeLinejoin="miter"
      />
      <Path
        d="M12.5 37c5.5 3.5 14.5 3.5 20 0v-7s9-4.5 6-10.5c-4-6.5-13.5-3.5-16 4V27v-3.5c-2.5-7.5-12-10.5-16-4-3 6 6 10.5 6 10.5v7"
        fill="#fff"
        stroke="#000"
      />
      <Path
        d="M12.5 30c5.5-3 14.5-3 20 0M12.5 33.5c5.5-3 14.5-3 20 0M12.5 37c5.5-3 14.5-3 20 0"
        fill="none"
        stroke="#000"
      />
    </G>
  </Svg>
);

export const bP = () => (
    <Svg width={45} height={45} viewBox="0 0 45 45">
    <Path
      d="M22.5 9c-2.21 0-4 1.79-4 4 0 .89.29 1.71.78 2.38C17.33 16.5 16 18.59 16 21c0 2.03.94 3.84 2.41 5.03-3 1.06-7.41 5.55-7.41 13.47h23c0-7.92-4.41-12.41-7.41-13.47 1.47-1.19 2.41-3 2.41-5.03 0-2.41-1.33-4.5-3.28-5.62.49-.67.78-1.49.78-2.38 0-2.21-1.79-4-4-4z"
      fill="#000"
      fillOpacity={1}
      fillRule="nonzero"
      stroke="#000"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="miter"
      strokeMiterlimit={4}
      strokeDasharray="none"
      strokeOpacity={1}
    />
  </Svg>
);

export const bR = () => (
    <Svg width={45} height={45} viewBox="0 0 45 45">
    <G
      fill="#000"
      fillOpacity={1}
      fillRule="evenodd"
      stroke="#000"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit={4}
      strokeDasharray="none"
      strokeOpacity={1}
    >
      <Path
        d="M9 39h27v-3H9v3zM12.5 32l1.5-2.5h17l1.5 2.5h-20zM12 36v-4h21v4H12z"
        strokeLinecap="butt"
      />
      <Path
        d="M14 29.5v-13h17v13H14z"
        strokeLinecap="butt"
        strokeLinejoin="miter"
      />
      <Path
        d="M14 16.5 11 14h23l-3 2.5H14zM11 14V9h4v2h5V9h5v2h5V9h4v5H11z"
        strokeLinecap="butt"
      />
      <Path
        d="M12 35.5h21M13 31.5h19M14 29.5h17M14 16.5h17M11 14h23"
        fill="none"
        stroke="#fff"
        strokeWidth={1}
        strokeLinejoin="miter"
      />
    </G>
  </Svg>
);

export const bN = () => (
      <Svg width={45} height={45} viewBox="0 0 45 45">
        <G
          fill="none"
          fillOpacity={1}
          fillRule="evenodd"
          stroke="#000"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeMiterlimit={4}
          strokeDasharray="none"
          strokeOpacity={1}
        >
          <Path
            d="M22 10c10.5 1 16.5 8 16 29H15c0-9 10-6.5 8-21"
            fill="#000"
            stroke="#000"
          />
          <Path
            d="M24 18c.38 2.91-5.55 7.37-8 9-3 2-2.82 4.34-5 4-1.042-.94 1.41-3.04 0-3-1 0 .19 1.23-1 2-1 0-4.003 1-4-4 0-2 6-12 6-12s1.89-1.9 2-3.5c-.73-.994-.5-2-.5-3 1-1 3 2.5 3 2.5h2s.78-1.992 2.5-3c1 0 1 3 1 3"
            fill="#000"
            stroke="#000"
          />
          <Path
            d="M9.5 25.5a.5.5 0 1 1-1 0 .5.5 0 1 1 1 0z"
            fill="#fff"
            stroke="#fff"
          />
          <Path
            d="M15 15.5a.5 1.5 0 1 1-1 0 .5 1.5 0 1 1 1 0z"
            fill="#fff"
            stroke="#fff"
            transform="rotate(30 14.5 15.5)"
          />
          <Path
            stroke="none"
            d="m24.55 10.4-.45 1.45.5.15c3.15 1 5.65 2.49 7.9 6.75S35.75 29.06 35.25 39l-.05.5h2.25l.05-.5c.5-10.06-.88-16.85-3.25-21.34-2.37-4.49-5.79-6.64-9.19-7.16l-.51-.1z"
            fill="#fff"
          />
        </G>
      </Svg>    
);

export const bB = () => (
    <Svg width={45} height={45} viewBox="0 0 45 45">
    <G
      fill="none"
      fillOpacity={1}
      fillRule="evenodd"
      stroke="#000"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit={4}
      strokeDasharray="none"
      strokeOpacity={1}
    >
      <G
        fill="#000"
        stroke="#000"
        strokeLinecap="butt"
      >
        <Path d="M9 36c3.39-.97 10.11.43 13.5-2 3.39 2.43 10.11 1.03 13.5 2 0 0 1.65.54 3 2-.68.97-1.65.99-3 .5-3.39-.97-10.11.46-13.5-1-3.39 1.46-10.11.03-13.5 1-1.35.49-2.32.47-3-.5 1.35-1.46 3-2 3-2z" />
        <Path d="M15 32c2.5 2.5 12.5 2.5 15 0 .5-1.5 0-2 0-2 0-2.5-2.5-4-2.5-4 5.5-1.5 6-11.5-5-15.5-11 4-10.5 14-5 15.5 0 0-2.5 1.5-2.5 4 0 0-.5.5 0 2z" />
        <Path d="M25 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 1 1 5 0z" />
      </G>
      <Path
        d="M17.5 26h10M15 30h15m-7.5-14.5v5M20 18h5"
        fill="none"
        stroke="#fff"
        strokeLinejoin="miter"
      />
    </G>
  </Svg>
);

export const bQ = () => (
<Svg width={45} height={45} viewBox="0 0 45 45">
    <G
      fill="#000"
      stroke="#000"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <Path
        d="M9 26c8.5-1.5 21-1.5 27 0l2.5-12.5L31 25l-.3-14.1-5.2 13.6-3-14.5-3 14.5-5.2-13.6L14 25 6.5 13.5 9 26z"
        strokeLinecap="butt"
      />
      <Path d="M9 26c0 2 1.5 2 2.5 4 1 1.5 1 1 .5 3.5-1.5 1-1 2.5-1 2.5-1.5 1.5 0 2.5 0 2.5 6.5 1 16.5 1 23 0 0 0 1.5-1 0-2.5 0 0 .5-1.5-1-2.5-.5-2.5-.5-2 .5-3.5 1-2 2.5-2 2.5-4-8.5-1.5-18.5-1.5-27 0z" />
      <Path d="M11.5 30c3.5-1 18.5-1 22 0M12 33.5c6-1 15-1 21 0" />
      <Circle cx={6} cy={12} r={2} />
      <Circle cx={14} cy={9} r={2} />
      <Circle cx={22.5} cy={8} r={2} />
      <Circle cx={31} cy={9} r={2} />
      <Circle cx={39} cy={12} r={2} />
      <Path
        d="M11 38.5a35 35 1 0 0 23 0"
        fill="none"
        stroke="#000"
        strokeLinecap="butt"
      />
      <G
        fill="none"
        stroke="#fff"
      >
        <Path d="M11 29a35 35 1 0 1 23 0M12.5 31.5h20M11.5 34.5a35 35 1 0 0 22 0M10.5 37.5a35 35 1 0 0 24 0" />
      </G>
    </G>
  </Svg>
);

export const bK = () => (
      <Svg width={45} height={45} viewBox="0 0 45 45">
        <G
          fill="none"
          fillOpacity={1}
          fillRule="evenodd"
          stroke="#000"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeMiterlimit={4}
          strokeDasharray="none"
          strokeOpacity={1}
        >
          <Path
            d="M22.5 11.63V6"
            fill="none"
            stroke="#000"
            strokeLinejoin="miter"
          />
          <Path
            d="M22.5 25s4.5-7.5 3-10.5c0 0-1-2.5-3-2.5s-3 2.5-3 2.5c-1.5 3 3 10.5 3 10.5"
            fill="#000"
            strokeLinecap="butt"
            strokeLinejoin="miter"
          />
          <Path
            d="M12.5 37c5.5 3.5 14.5 3.5 20 0v-7s9-4.5 6-10.5c-4-6.5-13.5-3.5-16 4V27v-3.5c-2.5-7.5-12-10.5-16-4-3 6 6 10.5 6 10.5v7"
            fill="#000"
            stroke="#000"
          />
          <Path
            d="M20 8h5"
            fill="none"
            stroke="#000"
            strokeLinejoin="miter"
          />
          <Path
            d="M32 29.5s8.5-4 6.03-9.65C34.15 14 25 18 22.5 24.5v2.1-2.1C20 18 10.85 14 6.97 19.85 4.5 25.5 13 29.5 13 29.5"
            fill="none"
            stroke="#fff"
          />
          <Path
            d="M12.5 30c5.5-3 14.5-3 20 0m-20 3.5c5.5-3 14.5-3 20 0m-20 3.5c5.5-3 14.5-3 20 0"
            fill="none"
            stroke="#fff"
          />
        </G>
      </Svg>    
);

export const defaultPieces = {
  wP,
  wR,
  wN,
  wB,
  wQ,
  wK,
  bP,
  bR,
  bN,
  bB,
  bQ,
  bK,
};
