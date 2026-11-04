import os
import re

def format_srt_time(seconds):
    hours = int(seconds // 3600)
    minutes = int((seconds % 3600) // 60)
    secs = int(seconds % 60)
    millis = int(round((seconds - int(seconds)) * 1000))
    if millis >= 1000:
        secs += 1
        millis -= 1000
    return f"{hours:02d}:{minutes:02d}:{secs:02d},{millis:03d}"

def write_srt(filename, entries):
    lines = []
    for idx, (start, end, text) in enumerate(entries, 1):
        lines.append(str(idx))
        lines.append(f"{format_srt_time(start)} --> {format_srt_time(end)}")
        lines.append(text.strip())
        lines.append("")
    content = "\n".join(lines)
    with open(filename, "w", encoding="utf-8") as f:
        f.write(content)
    return content

# Part 1 Sentences (from src/part1/captions.ts)
part1_sentences = [
    [0.20, 2.63, "What if your dead friend suddenly messaged you…"],
    [2.71, 5.60, "and the message was something only you could understand?"],
    [5.68, 8.80, "At 2:17 in the morning, Arjun was alone in his bedroom."],
    [8.88, 11.22, "His phone was restoring an old backup."],
    [11.30, 13.00, "Then a conversation appeared."],
    [13.08, 13.76, "The sender?"],
    [13.84, 14.15, "Dev."],
    [14.35, 15.33, "His best friend."],
    [15.45, 17.68, "Who had died exactly one year ago."],
    [17.95, 19.84, "Arjun opened the conversation."],
    [19.92, 21.77, "There was one recovered message."],
    [21.85, 23.28, "YOU SAID YOU WOULDN'T TELL THEM."],
    [23.80, 25.05, "His hands went cold."],
    [25.13, 26.53, "He stared at the screen."],
    [26.75, 28.71, "Then another old message appeared."],
    [28.79, 30.91, "Do you remember what happened at the house?"],
    [31.20, 33.81, "Arjun immediately closed the conversation."],
    [33.89, 36.30, "He told himself it was just an old backup."],
    [36.38, 37.02, "A glitch."],
    [37.10, 37.88, "Nothing more."],
    [37.96, 39.37, "But then he noticed something."],
    [39.45, 41.50, "The conversation wasn't from today."],
    [41.58, 43.31, "It was from the night Dev died."],
    [43.80, 46.18, "Arjun opened the old conversation again."],
    [46.26, 47.91, "There was a photograph attached."],
    [47.99, 48.81, "Five friends."],
    [48.89, 51.01, "Standing outside the abandoned house."],
    [51.09, 51.94, "He zoomed in."],
    [52.02, 52.88, "And whispered…"],
    [52.96, 55.50, "Why is everyone looking at me?"],
]

# Part 2 Viral Loop Sentences (from src/part2/captions_loop.ts)
part2_sentences = [
    [0.15, 2.22, "There were five people in this photograph."],
    [2.25, 4.09, "So who is standing in that window?"],
    [4.60, 7.50, "The next morning, Arjun showed the photo to his friends."],
    [8.00, 9.71, "It was taken the night Dev died."],
    [10.30, 11.97, "Meera had taken the picture."],
    [12.10, 14.33, "Nobody remembered anyone else being there."],
    [14.50, 16.90, "Rahul said it was probably a reflection."],
    [17.00, 19.35, "That's impossible. He's facing forward."],
    [19.60, 20.75, "Nisha went quiet."],
    [21.00, 22.83, "And Meera said something strange."],
    [23.00, 25.06, "Why does that person look like Arjun?"],
    [25.50, 26.91, "Arjun looked closer."],
    [27.20, 29.16, "The figure was wearing the same jacket."],
    [29.50, 31.53, "Standing at the exact same angle."],
    [32.20, 35.95, "It looked like his own reflection... but that was impossible."],
    [36.60, 38.54, "Then he turned the photograph over."],
    [40.50, 42.88, "IF WE FORGET, WATCH THE VIDEO."],
    [43.50, 44.71, "Arjun had written it."],
    [45.00, 46.95, "And he had no memory of doing so."],
    [47.80, 50.00, "Wait... look at the window again."],
]

# Part 3 Sentences (from scripts/build_part3_voiceover.py)
part3_sentences = [
    [0.15, 1.50, "Five friends."],
    [1.60, 3.00, "One photograph."],
    [3.10, 5.80, "And four completely different memories."],
    [6.10, 8.60, "Rahul remembered Dev leaving the house alone."],
    [8.80, 11.00, "Meera remembered Arjun following him."],
    [11.20, 13.30, "Kabir remembered hearing an argument."],
    [13.45, 15.50, "Nisha remembered someone shouting."],
    [15.60, 17.10, "Don't touch me!"],
    [17.30, 20.20, "But nobody agreed on who said it."],
    [20.60, 22.60, "Arjun listened without speaking."],
    [22.80, 24.60, "Then he asked one question."],
    [24.80, 27.80, "Did anyone actually see Dev fall?"],
    [28.20, 29.80, "Silence."],
    [30.10, 31.80, "Nobody had."],
    [32.20, 34.20, "Meera suddenly remembered something."],
    [34.40, 37.80, "That night, Dev had placed his phone against the hallway wall."],
    [38.00, 40.10, "He wanted to record everyone together."],
    [40.35, 43.10, "She thought the video was still on his old phone."],
    [43.60, 45.20, "Arjun froze."],
    [45.50, 47.90, "The recording was from the hallway."],
    [48.10, 50.60, "Facing the balcony where Dev fell."],
    [50.80, 53.80, "And the video file was still playing."],
    [54.00, 58.00, "Who is lying? Rahul or Meera? Subscribe for Part 4."],
]

# Part 3 Viral 26s Sentences (from src/part3_viral/captions.ts)
part3_viral_26s_sentences = [
    [0.15, 2.18, "Five friends. One photograph."],
    [1.85, 3.75, "And four completely different memories."],
    [3.90, 5.44, "Rahul said Dev left alone."],
    [5.60, 7.48, "Meera swore Arjun followed him."],
    [7.50, 8.83, "Kabir heard them fighting."],
    [9.10, 9.89, "Don't touch me!"],
    [10.40, 11.79, "None of their stories matched."],
    [12.40, 14.31, "Did anyone actually see him fall?"],
    [15.00, 15.82, "Nobody had."],
    [16.60, 20.00, "Because that night, Dev was secretly recording in the hallway..."],
    [20.30, 23.06, "And that video is still inside the abandoned house."],
    [24.20, 25.60, "Look at the window again."],
]

# Part 3 Master 42s Sentences (from scripts/build_part3_42s_master.py)
part3_master_42s_sentences = [
    [0.20, 4.45, "Minutes after this final photo was taken, Dev fell from that balcony."],
    [4.60, 8.13, "Four friends gave an alibi. But their stories don't add up."],
    [8.30, 10.95, "Rahul swore Dev walked out the front gate alone."],
    [11.20, 13.84, "Meera claimed Arjun followed him into the dark."],
    [14.10, 16.51, "Kabir heard two people fighting in the hallway."],
    [16.80, 17.63, "Don't touch me!"],
    [17.80, 20.19, "And Nisha heard someone scream on the stairs."],
    [20.40, 21.91, "None of their stories matched."],
    [22.10, 24.04, "Then Arjun asked one question."],
    [24.30, 26.24, "Did anyone actually see Dev fall?"],
    [27.00, 28.84, "Silence. Nobody had."],
    [29.20, 32.61, "Because that night, Dev was secretly recording the hallway..."],
    [32.80, 35.05, "Facing the exact balcony where he fell."],
    [35.30, 38.10, "And that video is still inside the abandoned house."],
    [38.90, 40.97, "Look at the window again. Because..."],
]

os.makedirs("output final videos", exist_ok=True)
os.makedirs("C:/Users/krish/.gemini/antigravity/brain/f121ac42-ec30-4d0b-b4c6-7d42d77cce5b", exist_ok=True)

write_srt("output final videos/Everyone_Remembers_Part1_The_Message.srt", part1_sentences)
write_srt("output final videos/Everyone_Remembers_Part2_The_Extra_Person.srt", part2_sentences)
write_srt("output final videos/Everyone_Remembers_Part3_Five_Memories.srt", part3_sentences)
write_srt("output final videos/Everyone_Remembers_Part3_Viral_26s.srt", part3_viral_26s_sentences)
write_srt("output final videos/Everyone_Remembers_Part3_Master_42s.srt", part3_master_42s_sentences)

write_srt("C:/Users/krish/.gemini/antigravity/brain/f121ac42-ec30-4d0b-b4c6-7d42d77cce5b/Part1_The_Message.srt", part1_sentences)
write_srt("C:/Users/krish/.gemini/antigravity/brain/f121ac42-ec30-4d0b-b4c6-7d42d77cce5b/Part2_The_Extra_Person.srt", part2_sentences)
write_srt("C:/Users/krish/.gemini/antigravity/brain/f121ac42-ec30-4d0b-b4c6-7d42d77cce5b/Part3_Five_Memories.srt", part3_sentences)
write_srt("C:/Users/krish/.gemini/antigravity/brain/f121ac42-ec30-4d0b-b4c6-7d42d77cce5b/Part3_Viral_26s.srt", part3_viral_26s_sentences)
write_srt("C:/Users/krish/.gemini/antigravity/brain/f121ac42-ec30-4d0b-b4c6-7d42d77cce5b/Part3_Master_42s.srt", part3_master_42s_sentences)

print("SRT generation complete!")

