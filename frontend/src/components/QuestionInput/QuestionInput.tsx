import { Button, Group, Textarea } from "@mantine/core";
import { IconSend } from "@tabler/icons-react";
import { useState } from "react";

interface QuestionInputProps {
	onSend: (message: string) => void;
	disabled?: boolean;
}

function QuestionInput({ onSend, disabled = false }: QuestionInputProps) {
	const [input, setInput] = useState("");

	const handleSubmit = () => {
		if (input.trim() && !disabled) {
			onSend(input.trim());
			setInput("");
		}
	};

	const handleKeyDown = (event: React.KeyboardEvent) => {
		if (event.key === "Enter" && !event.shiftKey) {
			event.preventDefault();
			handleSubmit();
		}
	};

	return (
		<Group align="flex-end" gap="sm">
			<Textarea
				placeholder="メッセージを入力してください... (Enterで送信、Shift+Enterで改行)"
				value={input}
				onChange={(event) => setInput(event.currentTarget.value)}
				onKeyDown={handleKeyDown}
				autosize
				minRows={1}
				maxRows={10}
				style={{
					flex: 1,
				}}
				styles={{
					input: {
						border: "2px solid rgba(102, 126, 234, 0.2)",
						borderRadius: "16px",
						background: "rgba(255, 255, 255, 0.8)",
						backdropFilter: "blur(10px)",
						transition: "all 0.3s ease",
						"&:focus": {
							borderColor: "#667eea",
							boxShadow: "0 0 0 3px rgba(102, 126, 234, 0.1)",
							background: "rgba(255, 255, 255, 0.95)",
						},
					},
				}}
				disabled={disabled}
			/>
			<Button
				onClick={handleSubmit}
				disabled={!input.trim() || disabled}
				leftSection={<IconSend size={16} />}
				size="md"
				radius="xl"
				style={{
					background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
					border: "none",
					boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)",
					transition: "all 0.3s ease",
				}}
				styles={{
					root: {
						"&:hover": {
							transform: "translateY(-2px)",
							boxShadow: "0 6px 20px rgba(102, 126, 234, 0.6)",
						},
						"&:active": {
							transform: "translateY(0px)",
						},
					},
				}}
			>
				送信
			</Button>
		</Group>
	);
}

export default QuestionInput;
