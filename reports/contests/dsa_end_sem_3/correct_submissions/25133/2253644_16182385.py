# s=input()
# c=0
# for i in range(len(s)):
#     if (ord("b")<=s[i]<=ord("d")):
#         c+=1
# print(c
s=input()
c=0
for ch in s:
    if ch not in "aeiou":
        c=c+1
print(c)