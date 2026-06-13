a,b=map(int,input().split())
hello=[]
for i in range(a,b+1):
    if i%2!=0:
        hello.append(i)

print(*hello)