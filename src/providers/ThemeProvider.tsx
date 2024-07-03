"use client";
import React from "react";
import { ConfigProvider } from "antd";
import { useServerInsertedHTML } from "next/navigation";
import { createCache, extractStyle, StyleProvider } from "@ant-design/cssinjs";
import type Entity from "@ant-design/cssinjs/es/Cache";
import { AppProgressBar } from "next-nprogress-bar";
import { configuration } from "@/theme";

export const ThemeProvider = ({ children }: React.PropsWithChildren) => {
  const cache = React.useMemo<Entity>(() => createCache(), []);
  const isServerInserted = React.useRef<boolean>(false);

  useServerInsertedHTML(() => {
    if (isServerInserted.current) return;
    isServerInserted.current = true;

    return (
      <style
        id="antd"
        dangerouslySetInnerHTML={{ __html: extractStyle(cache, true) }}
      />
    );
  });

  return (
    <StyleProvider cache={cache}>
      <ConfigProvider componentSize="middle" theme={configuration}>
        {children}
        <AppProgressBar color="#276FC2" height="2px" shallowRouting />
      </ConfigProvider>
    </StyleProvider>
  );
};
