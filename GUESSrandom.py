import random
randNumber = random.randint(1,100)
# print(randNumber)
userGuess=None
guesses=0

while(userGuess != randNumber):
    userGuess=int(input("Enter your guess: "))
    guesses +=1
    if(userGuess==randNumber):
        print("You guessed it right!!")
    else:
        if(userGuess>randNumber):
            print("You guessed it wrong!! Enter a smaller number")
        else: 
            print("You guessed it wrong!! Enter a larger number")   

            
print(f"You guess the number in {guesses} guesses")    
with open("highscore.txt","r") as f:
    highscore= int(f.read())
     
if(guesses<highscore):
    print("YOU HAS JUST BROKEN THE HIGH SCORE!!!!")
with open("highscore.txt","w") as f:
      f.write(str(guesses))
        
 