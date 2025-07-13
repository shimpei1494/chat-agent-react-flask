import { Avatar, Group, Paper, Text } from "@mantine/core";
import { IconRobot, IconUser } from "@tabler/icons-react";

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

	return (
		<Paper
			p="lg"
			radius="xl"
			shadow="md"
			style={{
				background: isUser
					? "linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)"
					: "rgba(255, 255, 255, 0.9)",
				marginLeft: isUser ? "15%" : "0",
				marginRight: isUser ? "0" : "15%",
				border: `1px solid ${isUser ? "rgba(102, 126, 234, 0.2)" : "rgba(0, 0, 0, 0.1)"}`,
				backdropFilter: "blur(10px)",
				transition: "all 0.3s ease",
			}}
		>
			<Group align="flex-start" gap="md">
				<Avatar
					size="md"
					radius="xl"
					style={{
						background: isUser
							? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
							: "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
						boxShadow: "0 4px 15px rgba(0, 0, 0, 0.15)",
					}}
				>
					{isUser ? <IconUser size={18} /> : <IconRobot size={18} />}
				</Avatar>
				<div style={{ flex: 1 }}>
					<Text size="sm" c="dimmed" mb={6} fw={500}>
						{isUser ? "あなた" : "AI アシスタント"}
					</Text>
					<Text
						size="sm"
						style={{
							whiteSpace: "pre-wrap",
							wordBreak: "break-word",
							lineHeight: 1.6,
						}}
					>
						{message.content}
					</Text>
				</div>
			</Group>
		</Paper>
	);
}

export default Answer;
