import random

def game(comp,you):
    if comp==you:
        return None
    elif comp =='ROCK':
        if you=='PAPER':
            return True
        elif you=='SCISSOR':
            return False
    elif comp =='PAPER':
        if you=='SCISSOR':
            return True
        elif you=='ROCK':
            return False
    elif comp =='SCISSOR':
        if you=='ROCK':
            return True
        elif you=='PAPER':
            return False    
print("Comp 1 Turn: Rock(ROCK)), Paper(PAPER) or Scissor(SCISSOR)?")
randno= random.randint(1,3)
print(randno)
if randno == 1:
    comp='ROCK'
elif randno == 2:
    comp ='PAPER'
else:
    comp = 'SCISSOR'    
you=input("Player 2 Turn: Rock(ROCK), Paper(PAPER) or Gun(g)?")
a=game(comp,you)
print("Computer choose: ",comp)
print("you choose: ",you)
if a== None:
    print("the game is a tie")
elif a:
    print("you win")
else:
    print("you lose")