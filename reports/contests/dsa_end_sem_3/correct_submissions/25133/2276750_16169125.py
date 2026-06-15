# Your code here
a=input()
vowel=["a","e","i","o","u"]
no=0
for i in a:
    if i not in vowel:
        no+=1
print(no)