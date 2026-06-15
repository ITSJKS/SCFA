# n=int(input())
# arr=list(map(int,input().split()))
# d=[]
# for i in range(len(arr)-1):
    
    
#     if arr[i]>0 and arr[i+1]<0:
#         if abs(arr[i+1])>abs(arr[i]):

#             d.append(arr[i+1])
  

        

        
    
#     elif arr[i]<0 and arr[i+1]>0:
#         if(abs(arr[i])<abs(arr[i+1])):

#             d.append(arr[i+1])
#     else:
#         d.append(arr[i])
#         d.append(arr[i+1])



# if d:
#     print(*d)
# else:
#     print()
n = int(input())
arr = list(map(int, input().split()))

stack = []

for asteroid in arr:
    alive = True

    while alive and asteroid < 0 and stack and stack[-1] > 0:

        if stack[-1] < -asteroid:
            stack.pop()          # stack asteroid explodes

        elif stack[-1] == -asteroid:
            stack.pop()          # both explode
            alive = False

        else:
            alive = False        # current asteroid explodes

    if alive:
        stack.append(asteroid)

print(*stack)