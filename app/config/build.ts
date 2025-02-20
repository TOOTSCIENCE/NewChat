import tauriConfig from "../../src-tauri/tauri.conf.json";
import { DEFAULT_INPUT_TEMPLATE } from "../constant";

export const getBuildConfig = () => {
  if (typeof process === "undefined") {
    throw Error(
      "[Server Config] you are importing a nodejs-only module outside of nodejs",
    );
  }

  const buildMode = process.env.BUILD_MODE ?? "standalone";
  const isApp = !!process.env.BUILD_APP;
  const version = "v" + tauriConfig.package.version;
  const customModelProvider = process.env.CUSTOM_MODEL_PROVIDER ?? "deepseek";
  const customModelProviderUrl = process.env.CUSTOM_MODEL_PROVIDER_URL ?? "https://api.deepseek.com";
  const customModelProviderApiPath = process.env.CUSTOM_MODEL_PROVIDER_API_PATH ?? "/api/deepseek";
  const customModelProviderChatPath = process.env.CUSTOM_MODEL_PROVIDER_CHAT_PATH ?? "chat/completions";

  const commitInfo = (() => {
    try {
      const childProcess = require("child_process");
      const commitDate: string = childProcess
        .execSync('git log -1 --format="%at000" --date=unix')
        .toString()
        .trim();
      const commitHash: string = childProcess
        .execSync('git log --pretty=format:"%H" -n 1')
        .toString()
        .trim();

      return { commitDate, commitHash };
    } catch (e) {
      console.error("[Build Config] No git or not from git repo.");
      return {
        commitDate: "unknown",
        commitHash: "unknown",
      };
    }
  })();

  return {
    version,
    ...commitInfo,
    buildMode,
    isApp,
    customModelProvider,
    customModelProviderUrl,
    customModelProviderApiPath,
    customModelProviderChatPath,
    template: process.env.DEFAULT_INPUT_TEMPLATE ?? DEFAULT_INPUT_TEMPLATE,
  };
};

export type BuildConfig = ReturnType<typeof getBuildConfig>;
