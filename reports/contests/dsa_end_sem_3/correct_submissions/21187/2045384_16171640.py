# Your code here
n=int(input())
mat=[]
flag=True
for _ in range(n):
    row=list(map(int,input().split()))
    mat.append(row)
tt=[]
pp=[]
for i in range(n):
    for j in range(n):
        if i==j:
            tt.append(mat[i][j])
        if (n-1==(i+j)):
            pp.append(mat[i][j])
for i in range(len(tt)):
    for j in range(i+1,len(tt)):
        if tt[i]!=tt[j]:
            flag=False
for i in range(len(pp)):
    for j in range(i+1,len(pp)):
        if pp[i]!=pp[j]:
            flag=False

if flag==True:
    print("Double Harmony")
else:
    print("No Harmony")