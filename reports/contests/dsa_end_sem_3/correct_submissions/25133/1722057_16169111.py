# Your code here
# a,b=map(int,input().split())
# for i in range(a,b+1):
#     if i%2 != 0:
#         print(i,end=' ')

a=input()
c=0
for i in a:
    if i not in 'aeiou':
        c+=1
print(c)