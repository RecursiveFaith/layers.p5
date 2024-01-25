-- NOTES
-- This uses a cloning system

local light
local speakMessage = {} -- list of messages to say
local systemPrompt = 'Continue this dialog between Patrick Starfish and another character. Speak in very short quips and sentences as you are limited in number of characters. For example: Hey Patrick.\nHey Patrick.\nSo, I was thinking about how great it would be to have a pet jellyfish.\nJellyfish? Those things are scary!\nNot if you train them right. I could teach my jellyfish to do tricks, like fetch or roll over.\nThat would be pretty cool. I could train my jellyfish to sting people I don\'t like.\nThat\'s not very nice, Patrick.\nI know, but it would be funny.\nI guess it would be kind of funny. But I think I\'d rather train my jellyfish to do something more useful, like help me clean the house.\nThat\'s a great idea! Jellyfish are really good at cleaning. They could eat all the dirt and dust in no time.\nExactly! And they\'d be so much more fun to watch than a vacuum cleaner.\nI know, right? I\'m definitely getting a jellyfish now.\nMe too!'
local ID
local chatID
local hasInit = false
local promptToSend = ''
local isSending = false
local MIN_WAIT_TIME = 1
local MAX_WAIT_TIME = 6

function onStart()
  broadcast('getNewPatrickID')
end

function onReceivedID(resp)
  if (not hasInit) then
    if (getName() == 'Patrick 1') then
      ID = '1'
      light = getThing('Light 1')
      promptToSend='Ok lets give it a shot. Repeat after me: "Hey Patrick.". Dont respond but literally just say "Hey Patrick" please'
      MIN_WAIT_TIME=MIN_WAIT_TIME+.5
      wait(MIN_WAIT_TIME, sendChat)
    else
      ID = '2'
      say('Hey Patrick.')
      light = getThing('Light 2')
      light:enableLight()
    end

    disableLight()
    hasInit = true
  end
end

function sendChat()
  if not isSending then
    --print(ID .. ' # send # ' .. string.sub(systemPrompt, string.len(systemPrompt)-2000+1) .. '\n' .. promptToSend)
    chatID = aiChatCreate(string.sub(systemPrompt, string.len(systemPrompt)-2000+1))
    aiChat(chatID, promptToSend, onChatReceived)
  end
  isSending=true
end

function onChatReceived(resp)
  light:enableLight()
  isSending=false
  if resp then
    say(resp)
    broadcast('updateSystemPrompt', {prompt = resp})
    broadcast('finishedSpeaking', {agent=ID, resp=resp})
  end
end

function onFinishedSpeaking(resp)
  if (resp.agent == ID) then
    --print(ID .. ' # ' .. resp.resp)
    --broadcast('updateSystemPrompt', {prompt = resp.resp})
    say(resp.resp)
  else
    promptToSend='continue'
    MIN_WAIT_TIME=MIN_WAIT_TIME+.5
    wait(MIN_WAIT_TIME, sendChat)
  end
end

function onSyncPrompt(resp)
  systemPrompt = resp.prompt
end

function disableLight()
  light:disableLight()
end