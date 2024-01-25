-- @see https://rooms.xyz/oxozram/heypatrick
-- # The Global Bus
-- This object sets the mood by creating a fog effect
-- It also sets the systemPrompt and syncs it state between all clones
---
-- Bugs:
-- - Sometimes Patrick has nightmares :(
-- - Crashes after a while due to memory leak (I'm learning LUA today lol)
---

-- Change this to play with the mood
local systemPrompt = 'Continue this dialog between Patrick Starfish and another character. Pretend he is sharing dreams in the most Patrick Starfish way possible with another character. Speak in very short quips and sentences as you are limited in number of characters. For example: \nHey Patrick. \nHey Patrick. \nSo, I was thinking about how great it would be to have a pet jellyfish. \nJellyfish? Those things are scary! \nNot if you train them right. I could teach my jellyfish to do tricks, like fetch or roll over. \nThat would be pretty cool. I could train my jellyfish to sting people I don\'t like. \nThat\'s not very nice, Patrick. \nI know, but it would be funny. \nI guess it would be kind of funny. But I think I\'d rather train my jellyfish to do something more useful, like help me clean the house. \nThat\'s a great idea! Jellyfish are really good at cleaning. They could eat all the dirt and dust in no time. \nExactly! And they\'d be so much more fun to watch than a vacuum cleaner. \nI know, right? I\'m definitely getting a jellyfish now. \nMe too!\nHey Patrick.'

-- To simplify things we'll use clones
-- This makes it so each clone has their own ID
local patrickIDCounter=0
function onGetNewPatrickID()
  patrickIDCounter = patrickIDCounter + 1
  broadcast('receivedID', {ID = patrickIDCounter})
end

-- Makes sure all clones have same system prompt
function onUpdateSystemPrompt(resp)
  systemPrompt = systemPrompt .. resp.prompt
  broadcast('syncPrompt', {prompt=systemPrompt})
end

-- ##### Handle Cloud render
-- ##### Inspired by the bottom of SpaceX rocket
-- #############################################

-- create a list of hexadecimal digits
hex_digits = "0123456789ABCDEF"

-- define a function that returns a random hex digit
function random_hex_digit()
  local index = math.random(16)
  return hex_digits:sub(index, index)
end

-- define a function that returns a random hex color
function random_hex_color()
  local hex_color = ""
  for i = 1, 6 do
    hex_color = hex_color .. random_hex_digit()
  end
  hex_color = "#" .. hex_color
  return hex_color
end

-- Ring of plasma
function createParticleSystems(N, R)
  for i = 1, N do
    local angle = 2 * math.pi * i / N
    local lx = math.cos(angle) * R
    local ly = math.sin(angle) * R
    particles("plasma", {
      scale = 5,
      lz = 20,
      lx = lx,
      ly = ly+40,
      color = random_hex_color()
    })
  end
end
createParticleSystems(12, 100)
createParticleSystems(4, 60)
createParticleSystems(3, 30)
particles("plasma", {scale=5, lz=20})
