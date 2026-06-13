# Your code here
w="bcdfghjklmnpqrstvwxyz"
c=0
s=input()
for i in s:
    if(i in w):
        c=c+1
print(c)