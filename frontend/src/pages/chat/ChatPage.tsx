import {
	Avatar,
	Box,
	Card,
	Flex,
	Group,
	Paper,
	Stack,
	Text,
	Title,
} from "@mantine/core";
import { IconRobot } from "@tabler/icons-react";
import { useState } from "react";
import Answer from "../../components/Answer/Answer";
import ChatHistory from "../../components/ChatHistory/ChatHistory";
import ClearChatButton from "../../components/ClearChatButton/ClearChatButton";
import QuestionInput from "../../components/QuestionInput/QuestionInput";
import SettingsButton from "../../components/SettingsButton/SettingsButton";
import styles from "./ChatPage.module.css";

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
	const [typingIndicator, setTypingIndicator] = useState(false);
	const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
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
		setTypingIndicator(true);

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
			setTypingIndicator(false);
		} catch (error) {
			console.error("Error:", error);
			const errorMessage: Message = {
				id: crypto.randomUUID(),
				content: "Sorry, there was an error processing your request.",
				role: "assistant",
				timestamp: Date.now(),
			};
			setMessages((prev) => [...prev, errorMessage]);
			setTypingIndicator(false);
		} finally {
			setIsLoading(false);
			setTypingIndicator(false);
		}
	};

	const handleClearChat = () => {
		setMessages([]);
	};

	const handleNewChat = () => {
		setMessages([]);
	};

	const handleToggleSidebar = () => {
		setIsSidebarCollapsed(!isSidebarCollapsed);
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

			{/* Main layout with sidebar */}
			<Flex h="100%" style={{ position: "relative", zIndex: 1 }}>
				{/* Left Sidebar */}
				<Box p="md" style={{ flexShrink: 0 }}>
					<ChatHistory
						isCollapsed={isSidebarCollapsed}
						onToggle={handleToggleSidebar}
						onNewChat={handleNewChat}
					/>
				</Box>

				{/* Main Content Area */}
				<Box flex={1} p="md" pl={0}>
					<Stack h="100%" gap="md">
						{/* Modern Header */}
						<Card
							padding="lg"
							radius="xl"
							style={{
								background:
									"linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(240, 242, 255, 0.9) 100%)",
								backdropFilter: "blur(20px)",
								border: "none",
								boxShadow:
									"0 4px 20px rgba(102, 126, 234, 0.08), 0 1px 3px rgba(0, 0, 0, 0.05)",
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
							radius="xl"
							p="lg"
							style={{
								flex: 1,
								background:
									"linear-gradient(135deg, rgba(255, 255, 255, 0.85) 0%, rgba(248, 250, 255, 0.8) 100%)",
								backdropFilter: "blur(20px)",
								border: "none",
								boxShadow:
									"0 4px 20px rgba(102, 126, 234, 0.06), 0 1px 3px rgba(0, 0, 0, 0.05)",
								overflow: "hidden",
							}}
						>
							<Box
								h="100%"
								className={styles.chatArea}
								style={{ overflow: "auto", padding: "16px" }}
							>
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
													"linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
												borderRadius: "50%",
												display: "flex",
												alignItems: "center",
												justifyContent: "center",
												boxShadow: "0 20px 40px rgba(102, 126, 234, 0.3)",
											}}
										>
											<IconRobot size={48} color="white" />
										</Box>
										<Title order={3} ta="center" c="dimmed">
											こんにちは！何かお手伝いできることはありますか？
										</Title>
										<Text ta="center" c="dimmed" size="sm">
											何でもお気軽にお聞きください。AIがお答えします。
										</Text>
									</Flex>
								) : (
									<Box>
										{messages.map((message) => (
											<Answer key={message.id} message={message} />
										))}

										{/* Typing Indicator */}
										{typingIndicator && (
											<Box
												className={styles.typingIndicator}
												style={{
													display: "flex",
													justifyContent: "flex-start",
													marginBottom: "16px",
												}}
											>
												<Group align="flex-start" gap="xs">
													<Avatar
														size={36}
														radius="xl"
														style={{
															background:
																"linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
															boxShadow: "0 3px 12px rgba(0, 0, 0, 0.08)",
														}}
													>
														<IconRobot size={16} color="white" />
													</Avatar>
													<Paper
														p="md"
														radius="20px 20px 20px 4px"
														style={{
															background: "rgba(255, 255, 255, 0.95)",
															border: "none",
															backdropFilter: "blur(20px)",
															boxShadow: "0 2px 12px rgba(0, 0, 0, 0.08)",
															minWidth: "60px",
														}}
													>
														<Box
															style={{
																display: "flex",
																alignItems: "center",
																gap: "4px",
															}}
														>
															<Box className={styles.typingDot} />
															<Box className={styles.typingDot} />
															<Box className={styles.typingDot} />
														</Box>
													</Paper>
												</Group>
											</Box>
										)}
									</Box>
								)}
							</Box>
						</Card>

						{/* Input Area */}
						<Card
							padding="lg"
							radius="xl"
							style={{
								background:
									"linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(240, 242, 255, 0.9) 100%)",
								backdropFilter: "blur(20px)",
								border: "none",
								boxShadow:
									"0 4px 20px rgba(102, 126, 234, 0.08), 0 1px 3px rgba(0, 0, 0, 0.05)",
							}}
						>
							<QuestionInput onSend={handleSendMessage} disabled={isLoading} />
						</Card>
					</Stack>
				</Box>
			</Flex>
		</Box>
	);
}

export default ChatPage;
