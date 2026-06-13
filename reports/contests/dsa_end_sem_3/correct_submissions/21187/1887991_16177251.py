# Your code here
n=int(input())
mat=[]
x=0
for i in range(n):
    l=list(map(int,input().split()))
    mat.append(l)
if n==1:
    x=2
if n>1:
    for i in range(1,n):
        if mat[0][0]==mat[i][i]:
            x=1

        else:
            x=0
            break
        if mat[n-1][0]==mat[n-1-i][0+i]:
            x=2

        else:
            x=0
            break

if x==0:
    print("No Harmony")
elif x==2:
    print("Double Harmony")