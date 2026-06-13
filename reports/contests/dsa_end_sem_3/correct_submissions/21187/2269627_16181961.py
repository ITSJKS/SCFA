n=int(input())
a=[]

for i in range(n):
    row=list(map(int, input().split()))
    a.append(row)

s=[]
for i in range(n):
    for j in range(len(a[0])):
        if i==j:
            s.append(a[i][j])

p=[]
idx=len(a[0])-1
for i in range(n):
    for j in range(len(a[0])):
        if j==idx:
            p.append(a[i][j])
            idx-=1       

f1=False
for i in range(len(s)-1):
    if s[i]==s[i+1]:
        f1=True
    else:
        f1=False
        break

f2=False
for i in range(len(p)-1):
    if p[i]==p[i+1]:
        f2=True
    else:
        f2=False
        break

if (f1==True and f2==True) or p==s:
    print("Double Harmony")
else:
    print("No Harmony")