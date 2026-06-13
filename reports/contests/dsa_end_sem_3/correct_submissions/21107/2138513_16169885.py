# Your code here
def is_odd(n):
    if n%2!=0:
        return True 
    return False
L,R=map(int,input().split())
for i in range(L,R+1):
    if is_odd(i):
        print(i,end=" ")