# Your code here
s = input()
st = "aeiou"
c=0
for i in s:
    if i not in st:
        c+=1
print(c)