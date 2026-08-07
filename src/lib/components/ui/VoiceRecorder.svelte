<script lang="ts">
	import { Button } from "$lib/components/ui/button";
	import { Mic } from "lucide-svelte";

	type Props = {
		onRecordingComplete?: (text: string) => void;
		textToSpeak?: string;
	};

	let { onRecordingComplete, textToSpeak = "" }: Props = $props();

	let isRecording = $state(false);
	let recognition: any;
	let transcript = $state("");

	// Initialize Speech Recognition
	$effect(() => {
		if (typeof window !== "undefined") {
			const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
			if (SpeechRecognition) {
				recognition = new SpeechRecognition();
				recognition.continuous = true;
				recognition.interimResults = true;
				recognition.lang = "en-US";

				recognition.onresult = (event: any) => {
					let currentTranscript = "";
					for (let i = event.resultIndex; i < event.results.length; ++i) {
						currentTranscript += event.results[i][0].transcript;
					}
					transcript = currentTranscript;
				};

				recognition.onerror = (event: any) => {
					console.error("Speech recognition error", event.error);
					isRecording = false;
				};

				recognition.onend = () => {
					if (isRecording) {
						// Restart if stopped automatically (e.g. by silence)
						recognition.start();
					} else {
						if (transcript.trim() && onRecordingComplete) {
							onRecordingComplete(transcript.trim());
						}
					}
				};
			} else {
				console.warn("Speech Recognition API not supported in this browser.");
			}
		}

		return () => {
			if (recognition && isRecording) {
				recognition.stop();
			}
		};
	});

	// Handle Text-to-Speech synthesis
	$effect(() => {
		if (textToSpeak && typeof window !== "undefined" && "speechSynthesis" in window) {
			const utterance = new SpeechSynthesisUtterance(textToSpeak);
			window.speechSynthesis.speak(utterance);
		}
	});

	function toggleRecording() {
		if (!recognition) {
			alert("Speech Recognition API not supported in this browser.");
			return;
		}

		if (isRecording) {
			isRecording = false;
			recognition.stop();
		} else {
			transcript = "";
			isRecording = true;
			recognition.start();
		}
	}
</script>

<div class="flex items-center gap-2">
	<Button
		variant={isRecording ? "destructive" : "default"}
		size="icon"
		onclick={toggleRecording}
		class="rounded-full size-12 shadow-lg transition-all {isRecording ? 'animate-pulse' : ''}"
		title={isRecording ? "Stop Recording" : "Start Recording"}
	>
		<Mic class="size-5" />
	</Button>
	
	{#if isRecording && transcript}
		<span class="text-sm text-muted-foreground truncate max-w-[200px]">
			{transcript}
		</span>
	{/if}
</div>
