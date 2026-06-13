x=input()
d=0
for i in x:
    if i in "aeiou":
        d+=1
print(len(x)-d)