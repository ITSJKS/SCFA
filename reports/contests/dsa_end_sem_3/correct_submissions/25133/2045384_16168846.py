# Your code here
s=input()
x=0
for ch in s:
    if ch not in "aeiou":
        x+=1
print(x)