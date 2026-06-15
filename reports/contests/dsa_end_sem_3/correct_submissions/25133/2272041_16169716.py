# l,r=map(int,input().split())
# for i in range(l,r+1):
#     if i%2!=0:
#         print(i,end=" ")



s=input()
vowels="aeiouAEIOU"
c=0
for ch in s:
    if ch not in vowels:
        c+=1
print(c)