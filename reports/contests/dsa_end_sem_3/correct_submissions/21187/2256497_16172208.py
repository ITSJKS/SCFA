# Your code here
n=int(input())
l=[]
for i in range(n):
    e=list(map(int,input().split()))
    l.append(e)

PD=set()
SD=set()
for i in range(n):
    PD.add(l[i][i])

for i in range(n):
    SD.add(l[i][n-i-1])


if len(PD)>1 or len(SD)>1:
    print('No Harmony')
else:
    print('Double Harmony')