# def trap(arr):
def trap(arr):
    stack = []
    water = 0

    for i in range(len(arr)):
        while stack and arr[i] > arr[stack[-1]]:
            mid = stack.pop()

            if not stack:
                break

            left = stack[-1]
            width = i - left - 1
            height = min(arr[left], arr[i]) - arr[mid]

            water += width * height

        stack.append(i)

    return water