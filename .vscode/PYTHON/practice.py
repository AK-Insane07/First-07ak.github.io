a=int(input("enter total terms you need  :"))
res=list(map(lambda x:x**2,range(a)))
for i in range(a):
    print(f" 2 to the power {i} will be {res[i]}")

