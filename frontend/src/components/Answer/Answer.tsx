import { useEffect, useState } from "react";
import { Avatar, Box, Group, Paper, Text } from "@mantine/core";
import { IconRobot } from "@tabler/icons-react";
import styles from "./Answer.module.css";

interface Message {
	id: string;
	content: string;
	role: "user" | "assistant";
	timestamp: number;
}

interface AnswerProps {
	message: Message;
}

function Answer({ message }: AnswerProps) {
	const isUser = message.role === "user";
	const [isVisible, setIsVisible] = useState(false);

	useEffect(() => {
		const timer = setTimeout(() => setIsVisible(true), 100);
		return () => clearTimeout(timer);
	}, []);

	return (
		<Box
			className={`${styles.messageContainer} ${isVisible ? styles.fadeIn : ""}`}
			style={{
				display: "flex",
				justifyContent: isUser ? "flex-end" : "flex-start",
				marginBottom: "16px",
				opacity: isVisible ? 1 : 0,
			}}
		>
			<Group
				align="flex-start"
				gap="xs"
				style={{
					maxWidth: "75%",
					flexDirection: isUser ? "row-reverse" : "row",
				}}
			>
				{/* Avatar - Hidden for user messages in modern chat style */}
				{!isUser && (
					<Avatar
						size={36}
						radius="xl"
						style={{
							background: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
							boxShadow: "0 3px 12px rgba(0, 0, 0, 0.08)",
							flexShrink: 0,
						}}
					>
						<IconRobot size={16} color="white" />
					</Avatar>
				)}

				{/* Message bubble */}
				<Paper
					className={`${styles.messageHover} ${isUser ? styles.userMessageHover : styles.aiMessageHover}`}
					p="md"
					radius={isUser ? "20px 20px 4px 20px" : "20px 20px 20px 4px"}
					style={{
						background: isUser
							? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
							: "rgba(255, 255, 255, 0.95)",
						border: "none",
						backdropFilter: "blur(20px)",
						boxShadow: isUser
							? "0 4px 20px rgba(102, 126, 234, 0.25), 0 2px 8px rgba(0, 0, 0, 0.05)"
							: "0 2px 12px rgba(0, 0, 0, 0.08), 0 1px 4px rgba(0, 0, 0, 0.05)",
						position: "relative",
					}}
				>
					{/* Message content */}
					<Box>
						{/* Label - Only show for AI */}
						{!isUser && (
							<Text
								size="xs"
								c="dimmed"
								mb={4}
								fw={500}
								style={{ opacity: 0.8 }}
							>
								AI アシスタント
							</Text>
						)}

						{/* Message text */}
						<Text
							size="sm"
							c={isUser ? "white" : "dark"}
							style={{
								whiteSpace: "pre-wrap",
								wordBreak: "break-word",
								lineHeight: 1.5,
								fontWeight: isUser ? 500 : 400,
							}}
						>
							{message.content}
						</Text>

						{/* Timestamp */}
						<Text
							size="xs"
							c={isUser ? "rgba(255, 255, 255, 0.7)" : "dimmed"}
							mt={4}
							style={{
								textAlign: isUser ? "right" : "left",
								opacity: 0.6,
							}}
						>
							{new Date(message.timestamp).toLocaleTimeString("ja-JP", {
								hour: "2-digit",
								minute: "2-digit",
							})}
						</Text>
					</Box>
				</Paper>
			</Group>
		</Box>
	);
}

export default Answer;
