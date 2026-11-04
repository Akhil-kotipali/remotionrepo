/**
 * Note: When using the Node.JS APIs, the config file
 * doesn't apply. Instead, pass options directly to the APIs.
 *
 * All configuration options: https://remotion.dev/docs/config
 */

import { Config } from "@remotion/cli/config";
import { enableTailwind } from "@remotion/tailwind-v4";

// High-performance bundling & RTX 3050 hardware acceleration
Config.setRspack(true);
Config.setVideoImageFormat("jpeg");
Config.setOverwriteOutput(true);
Config.setChromiumOpenGlRenderer("angle"); // Direct DirectX/ANGLE GPU acceleration
Config.setConcurrency(4); // 4 parallel worker instances
Config.setCodec("h264");
Config.setPixelFormat("yuv420p");
Config.overrideBundlerConfig(enableTailwind);
