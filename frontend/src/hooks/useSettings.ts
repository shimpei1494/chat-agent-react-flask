import { useState } from "react";
import type { ChatSettings } from "../types/chat";

const DEFAULT_SETTINGS: ChatSettings = {
	model: "gpt-4o-mini",
	systemPrompt: "You are a helpful AI assistant.",
	temperature: 0.7,
};

export function useSettings() {
	const [settings, setSettings] = useState<ChatSettings>(DEFAULT_SETTINGS);

	return {
		settings,
		setSettings,
	};
}
