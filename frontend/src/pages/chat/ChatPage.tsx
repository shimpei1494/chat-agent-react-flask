import {
	Box,
	Card,
	Container,
	Flex,
	Group,
	Stack,
	Text,
	Title,
} from "@mantine/core";
import { useState } from "react";
import Answer from "../../components/Answer/Answer";
import ClearChatButton from "../../components/ClearChatButton/ClearChatButton";
import QuestionInput from "../../components/QuestionInput/QuestionInput";
import SettingsButton from "../../components/SettingsButton/SettingsButton";

interface Message {
	id: string;
	content: string;
	role: "user" | "assistant";
	timestamp: number;
}

interface ChatSettings {
	model: string;
	systemPrompt: string;
	temperature: number;
}

function ChatPage() {
	const [messages, setMessages] = useState<Message[]>([]);
	const [isLoading, setIsLoading] = useState(false);
	const [settings, setSettings] = useState<ChatSettings>({
		model: "gpt-4o-mini",
		systemPrompt: "You are a helpful AI assistant.",
		temperature: 0.7,
	});

	const handleSendMessage = async (content: string) => {
		const userMessage: Message = {
			id: crypto.randomUUID(),
			content,
			role: "user",
			timestamp: Date.now(),
		};

		setMessages((prev) => [...prev, userMessage]);
		setIsLoading(true);

		try {
			const response = await fetch("/api/v1/chat", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					message: content,
					history: messages,
					model: settings.model,
					system_prompt: settings.systemPrompt,
					temperature: settings.temperature,
				}),
			});

			if (!response.ok) {
				throw new Error("Failed to get response");
			}

			const data = await response.json();
			const assistantMessage: Message = {
				id: crypto.randomUUID(),
				content: data.response,
				role: "assistant",
				timestamp: Date.now(),
			};

			setMessages((prev) => [...prev, assistantMessage]);
		} catch (error) {
			console.error("Error:", error);
			const errorMessage: Message = {
				id: crypto.randomUUID(),
				content: "Sorry, there was an error processing your request.",
				role: "assistant",
				timestamp: Date.now(),
			};
			setMessages((prev) => [...prev, errorMessage]);
		} finally {
			setIsLoading(false);
		}
	};

	const handleClearChat = () => {
		setMessages([]);
	};

	return (
		<Box
			h="100vh"
			style={{
				background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
				position: "relative",
				overflow: "hidden",
			}}
		>
			{/* Background pattern overlay */}
			<Box
				style={{
					position: "absolute",
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					background: `
            radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.15) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(120, 119, 198, 0.2) 0%, transparent 50%)
          `,
				}}
			/>

			<Container size="lg" h="100%" style={{ position: "relative", zIndex: 1 }}>
				<Stack h="100%" gap="md" py="md">
					{/* Modern Header */}
					<Card
						shadow="xl"
						padding="lg"
						radius="xl"
						style={{
							background: "rgba(255, 255, 255, 0.95)",
							backdropFilter: "blur(20px)",
							border: "1px solid rgba(255, 255, 255, 0.2)",
						}}
					>
						<Flex justify="space-between" align="center">
							<Box>
								<Title
									order={1}
									size="2rem"
									style={{
										background: "linear-gradient(45deg, #667eea, #764ba2)",
										WebkitBackgroundClip: "text",
										WebkitTextFillColor: "transparent",
										fontWeight: 800,
										letterSpacing: "-0.5px",
									}}
								>
									AI Chat Agent
								</Title>
								<Text c="dimmed" size="sm" mt={2}>
									Powered by advanced AI models
								</Text>
							</Box>
							<Group gap="xs">
								<SettingsButton
									settings={settings}
									onSettingsChange={setSettings}
								/>
								<ClearChatButton onClear={handleClearChat} />
							</Group>
						</Flex>
					</Card>

					{/* Chat Area */}
					<Card
						shadow="xl"
						radius="xl"
						p="lg"
						style={{
							flex: 1,
							background: "rgba(255, 255, 255, 0.95)",
							backdropFilter: "blur(20px)",
							border: "1px solid rgba(255, 255, 255, 0.2)",
							overflow: "hidden",
						}}
					>
						<Box h="100%" style={{ overflow: "auto" }}>
							{messages.length === 0 ? (
								<Flex
									h="100%"
									direction="column"
									justify="center"
									align="center"
									gap="md"
								>
									<Box
										w={120}
										h={120}
										style={{
											background:
												"linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
											borderRadius: "50%",
											display: "flex",
											alignItems: "center",
											justifyContent: "center",
											boxShadow: "0 20px 40px rgba(102, 126, 234, 0.3)",
										}}
									>
										<Text
											size="3rem"
											style={{
												filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.2))",
											}}
										>
											🤖
										</Text>
									</Box>
									<Title order={3} ta="center" c="dimmed">
										こんにちは！何かお手伝いできることはありますか？
									</Title>
									<Text ta="center" c="dimmed" size="sm">
										何でもお気軽にお聞きください。AIがお答えします。
									</Text>
								</Flex>
							) : (
								<Stack gap="md">
									{messages.map((message) => (
										<Answer key={message.id} message={message} />
									))}
								</Stack>
							)}
						</Box>
					</Card>

					{/* Input Area */}
					<Card
						shadow="xl"
						padding="lg"
						radius="xl"
						style={{
							background: "rgba(255, 255, 255, 0.95)",
							backdropFilter: "blur(20px)",
							border: "1px solid rgba(255, 255, 255, 0.2)",
						}}
					>
						<QuestionInput onSend={handleSendMessage} disabled={isLoading} />
					</Card>
				</Stack>
			</Container>
		</Box>
	);
}

export default ChatPage;
