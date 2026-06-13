# Your code here
n=int(input())
l=[]
for i in range(n):
    a=list(map(int,input().split()))
    l.append(a)
def check():
    s=set()
    for i in range(n):
        for j in range(n):
            if i==j:
                s.add(l[i][j])
    if len(s)!=1:
        return False
    s=set()
    for i in range(n):
        for j in range(n):
            if i+j==n-1:
                s.add(l[i][j])
    if len(s)!=1:
        return False
    return True
if check():print("Double Harmony")
else:
    print("No Harmony")